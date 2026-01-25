import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLAN_LIMITS } from "@/lib/constants";
import { Prisma } from "@prisma/client";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    // Get original policy
    const originalPolicy = await prisma.policy.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!originalPolicy) {
      return NextResponse.json(
        { error: "Política no encontrada" },
        { status: 404 }
      );
    }

    // Check plan limits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { subscriptionTier: true },
    });

    const tier = user?.subscriptionTier || "FREE";
    const planLimit = PLAN_LIMITS[tier as keyof typeof PLAN_LIMITS];

    const currentPolicyCount = await prisma.policy.count({
      where: { userId: session.user.id },
    });

    if (currentPolicyCount >= planLimit.maxPolicies) {
      return NextResponse.json(
        {
          error: `Has alcanzado el límite de ${planLimit.maxPolicies} políticas de tu plan ${planLimit.name}`,
        },
        { status: 403 }
      );
    }

    // Create duplicate
    const duplicatedPolicy = await prisma.policy.create({
      data: {
        userId: session.user.id,
        name: `${originalPolicy.name} (Copia)`,
        status: "DRAFT",
        currentStep: 1,
        completedSteps: [],
        completionPct: 0,
        version: 1,
        // Copy all step data (cast to InputJsonValue for Prisma)
        step01Data: originalPolicy.step01Data as Prisma.InputJsonValue,
        step02Data: originalPolicy.step02Data as Prisma.InputJsonValue,
        step03Data: originalPolicy.step03Data as Prisma.InputJsonValue,
        step04Data: originalPolicy.step04Data as Prisma.InputJsonValue,
        step05Data: originalPolicy.step05Data as Prisma.InputJsonValue,
        step06Data: originalPolicy.step06Data as Prisma.InputJsonValue,
        step07Data: originalPolicy.step07Data as Prisma.InputJsonValue,
        step08Data: originalPolicy.step08Data as Prisma.InputJsonValue,
        step09Data: originalPolicy.step09Data as Prisma.InputJsonValue,
        step10Data: originalPolicy.step10Data as Prisma.InputJsonValue,
        step11Data: originalPolicy.step11Data as Prisma.InputJsonValue,
        step12Data: originalPolicy.step12Data as Prisma.InputJsonValue,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "POLICY_DUPLICATED",
        resource: "policy",
        resourceId: duplicatedPolicy.id,
        details: { originalPolicyId: id },
      },
    });

    return NextResponse.json({
      id: duplicatedPolicy.id,
      name: duplicatedPolicy.name,
      message: "Política duplicada correctamente",
    });
  } catch (error) {
    console.error("Error duplicating policy:", error);
    return NextResponse.json(
      { error: "Error al duplicar la política" },
      { status: 500 }
    );
  }
}
