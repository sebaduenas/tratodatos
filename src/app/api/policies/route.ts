import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { PLAN_LIMITS } from "@/lib/constants";

const createPolicySchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(200),
});

// GET /api/policies - List user's policies
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const policies = await prisma.policy.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        status: true,
        currentStep: true,
        completionPct: true,
        createdAt: true,
        updatedAt: true,
        publishedAt: true,
      },
    });

    return NextResponse.json({ policies });
  } catch (error) {
    console.error("Error fetching policies:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// POST /api/policies - Create new policy
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Check plan limits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { _count: { select: { policies: true } } },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const planLimit =
      PLAN_LIMITS[user.subscriptionTier as keyof typeof PLAN_LIMITS];

    if (user._count.policies >= planLimit.maxPolicies) {
      return NextResponse.json(
        {
          error: `Has alcanzado el límite de ${planLimit.maxPolicies} política(s) de tu plan ${planLimit.name}`,
          upgrade: true,
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name } = createPolicySchema.parse(body);

    const policy = await prisma.policy.create({
      data: {
        userId: session.user.id,
        name,
        status: "DRAFT",
        currentStep: 1,
        completedSteps: [],
        completionPct: 0,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "POLICY_CREATED",
        resource: "policy",
        resourceId: policy.id,
        details: { name },
      },
    });

    return NextResponse.json({ policy }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating policy:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
