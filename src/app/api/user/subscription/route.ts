import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateSubscriptionSchema = z.object({
  tier: z.enum(["FREE", "PROFESSIONAL", "ENTERPRISE"]),
});

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateSubscriptionSchema.parse(body);

    // For now, only allow downgrading to FREE
    // Paid plans will require payment integration
    if (validatedData.tier !== "FREE") {
      return NextResponse.json(
        { error: "Los planes de pago estarán disponibles próximamente" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        subscriptionTier: validatedData.tier,
      },
      select: {
        id: true,
        subscriptionTier: true,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "SUBSCRIPTION_CHANGED",
        resource: "user",
        resourceId: session.user.id,
        details: { newTier: validatedData.tier },
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { error: "Error al actualizar la suscripción" },
      { status: 500 }
    );
  }
}
