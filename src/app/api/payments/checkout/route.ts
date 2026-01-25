import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const checkoutSchema = z.object({
  plan: z.enum(["PROFESSIONAL", "ENTERPRISE"]),
  period: z.enum(["monthly", "yearly"]).default("monthly"),
});

// Precios en CLP
const PRICES = {
  PROFESSIONAL: {
    monthly: 9990,
    yearly: 99900, // 2 meses gratis
  },
  ENTERPRISE: {
    monthly: 29990,
    yearly: 299900, // 2 meses gratis
  },
};

// POST - Crear checkout session
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { plan, period } = checkoutSchema.parse(body);

    const amount = PRICES[plan][period];
    const description = `TratoDatos ${plan === "PROFESSIONAL" ? "Profesional" : "Empresa"} - ${period === "monthly" ? "Mensual" : "Anual"}`;

    // Crear registro de pago pendiente
    const payment = await prisma.payment.create({
      data: {
        userId: session.user.id,
        amount,
        currency: "CLP",
        status: "PENDING",
        provider: "MERCADOPAGO",
        externalId: `temp_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        metadata: {
          plan,
          period,
          userEmail: session.user.email,
          description,
        },
      },
    });

    // Verificar si MercadoPago está configurado
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    
    if (!accessToken) {
      // Modo desarrollo: simular checkout
      return NextResponse.json({
        checkoutUrl: `/dashboard/facturacion/simular-pago?paymentId=${payment.id}&plan=${plan}&amount=${amount}`,
        paymentId: payment.id,
        mode: "development",
        message: "MercadoPago no configurado. Usando modo simulación.",
      });
    }

    // Crear preferencia en MercadoPago
    const preference = {
      items: [
        {
          title: description,
          quantity: 1,
          currency_id: "CLP",
          unit_price: amount,
        },
      ],
      payer: {
        email: session.user.email,
      },
      back_urls: {
        success: `${process.env.NEXTAUTH_URL}/dashboard/facturacion/exito?payment_id=${payment.id}`,
        failure: `${process.env.NEXTAUTH_URL}/dashboard/facturacion/error?payment_id=${payment.id}`,
        pending: `${process.env.NEXTAUTH_URL}/dashboard/facturacion/pendiente?payment_id=${payment.id}`,
      },
      auto_return: "approved",
      external_reference: payment.id,
      notification_url: `${process.env.NEXTAUTH_URL}/api/payments/webhook`,
    };

    const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(preference),
    });

    if (!mpResponse.ok) {
      throw new Error("Error al crear preferencia en MercadoPago");
    }

    const mpData = await mpResponse.json();

    // Actualizar payment con ID de MercadoPago
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        externalId: mpData.id,
      },
    });

    return NextResponse.json({
      checkoutUrl: mpData.init_point,
      paymentId: payment.id,
      mode: "production",
    });
  } catch (error) {
    console.error("Error creating checkout:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al crear checkout" },
      { status: 500 }
    );
  }
}
