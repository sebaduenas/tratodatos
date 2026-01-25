import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLAN_LIMITS } from "@/lib/constants";

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
        // Copy all step data
        step01Data: originalPolicy.step01Data,
        step02Data: originalPolicy.step02Data,
        step03Data: originalPolicy.step03Data,
        step04Data: originalPolicy.step04Data,
        step05Data: originalPolicy.step05Data,
        step06Data: originalPolicy.step06Data,
        step07Data: originalPolicy.step07Data,
        step08Data: originalPolicy.step08Data,
        step09Data: originalPolicy.step09Data,
        step10Data: originalPolicy.step10Data,
        step11Data: originalPolicy.step11Data,
        step12Data: originalPolicy.step12Data,
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
