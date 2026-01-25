import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST - Simular pago (solo desarrollo)
export async function POST(request: NextRequest) {
  // Solo permitir en desarrollo
  if (process.env.NODE_ENV === "production" && process.env.MERCADOPAGO_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: "Endpoint no disponible en producción" },
      { status: 403 }
    );
  }

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { paymentId, success } = await request.json();

    if (!paymentId) {
      return NextResponse.json({ error: "Payment ID requerido" }, { status: 400 });
    }

    // Verificar que el pago pertenece al usuario
    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        userId: session.user.id,
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 });
    }

    const status = success ? "COMPLETED" : "FAILED";

    // Actualizar pago
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status,
      },
    });

    // Si exitoso, actualizar plan del usuario
    if (success) {
      const metadata = payment.metadata as { plan?: string } | null;
      const plan = metadata?.plan as "PROFESSIONAL" | "ENTERPRISE" | undefined;

      if (plan) {
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            subscriptionTier: plan,
          },
        });

        // Audit log
        await prisma.auditLog.create({
          data: {
            userId: session.user.id,
            action: "SUBSCRIPTION_UPGRADED",
            resource: "user",
            resourceId: session.user.id,
            details: {
              plan,
              paymentId,
              simulated: true,
            },
          },
        });
      }
    }

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error("Error simulating payment:", error);
    return NextResponse.json(
      { error: "Error al simular pago" },
      { status: 500 }
    );
  }
}
