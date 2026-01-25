import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Webhook de MercadoPago
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verificar tipo de notificación
    if (body.type !== "payment") {
      return NextResponse.json({ received: true });
    }

    const paymentId = body.data?.id;
    if (!paymentId) {
      return NextResponse.json({ error: "Missing payment ID" }, { status: 400 });
    }

    // Obtener detalles del pago desde MercadoPago
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json({ error: "MercadoPago not configured" }, { status: 500 });
    }

    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!mpResponse.ok) {
      throw new Error("Error al obtener pago de MercadoPago");
    }

    const mpPayment = await mpResponse.json();
    const externalReference = mpPayment.external_reference;

    // Buscar pago en nuestra base de datos
    const payment = await prisma.payment.findUnique({
      where: { id: externalReference },
    });

    if (!payment) {
      console.error("Payment not found:", externalReference);
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Mapear estado de MercadoPago a nuestro estado
    let status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED" = "PENDING";
    if (mpPayment.status === "approved") {
      status = "COMPLETED";
    } else if (["rejected", "cancelled"].includes(mpPayment.status)) {
      status = "FAILED";
    } else if (mpPayment.status === "refunded") {
      status = "REFUNDED";
    }

    // Actualizar pago
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status,
        externalId: String(paymentId),
      },
    });

    // Si el pago fue exitoso, actualizar suscripción del usuario
    if (status === "COMPLETED") {
      const metadata = payment.metadata as { plan?: string; period?: string } | null;
      const plan = metadata?.plan as "PROFESSIONAL" | "ENTERPRISE" | undefined;
      
      if (plan) {
        await prisma.user.update({
          where: { id: payment.userId },
          data: {
            subscriptionTier: plan,
          },
        });

        // Registrar en audit log
        await prisma.auditLog.create({
          data: {
            userId: payment.userId,
            action: "SUBSCRIPTION_UPGRADED",
            resource: "user",
            resourceId: payment.userId,
            details: {
              plan,
              paymentId: payment.id,
              amount: payment.amount,
            },
          },
        });
      }
    }

    return NextResponse.json({ received: true, status });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing error" },
      { status: 500 }
    );
  }
}
