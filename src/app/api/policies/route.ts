import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { PLAN_LIMITS } from "@/lib/constants";
import { Prisma } from "@prisma/client";

const createPolicySchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(200),
  templateId: z.string().optional(),
  templateData: z
    .object({
      step01Data: z.record(z.unknown()).optional(),
      step02Data: z.record(z.unknown()).optional(),
      step03Data: z.record(z.unknown()).optional(),
      step04Data: z.record(z.unknown()).optional(),
      step05Data: z.record(z.unknown()).optional(),
      step06Data: z.record(z.unknown()).optional(),
      step07Data: z.record(z.unknown()).optional(),
      step08Data: z.record(z.unknown()).optional(),
      step09Data: z.record(z.unknown()).optional(),
      step10Data: z.record(z.unknown()).optional(),
      step11Data: z.record(z.unknown()).optional(),
      step12Data: z.record(z.unknown()).optional(),
    })
    .optional(),
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
    const { name, templateId, templateData } = createPolicySchema.parse(body);

    // Prepare policy data with optional template
    const policyData: Prisma.PolicyCreateInput = {
      user: { connect: { id: session.user.id } },
      name,
      status: "DRAFT",
      currentStep: 1,
      completedSteps: [],
      completionPct: 0,
    };

    // Apply template data if provided
    if (templateData) {
      if (templateData.step01Data) {
        policyData.step01Data = templateData.step01Data as Prisma.InputJsonValue;
      }
      if (templateData.step02Data) {
        policyData.step02Data = templateData.step02Data as Prisma.InputJsonValue;
      }
      if (templateData.step03Data) {
        policyData.step03Data = templateData.step03Data as Prisma.InputJsonValue;
      }
      if (templateData.step04Data) {
        policyData.step04Data = templateData.step04Data as Prisma.InputJsonValue;
      }
      if (templateData.step05Data) {
        policyData.step05Data = templateData.step05Data as Prisma.InputJsonValue;
      }
      if (templateData.step06Data) {
        policyData.step06Data = templateData.step06Data as Prisma.InputJsonValue;
      }
      if (templateData.step07Data) {
        policyData.step07Data = templateData.step07Data as Prisma.InputJsonValue;
      }
      if (templateData.step08Data) {
        policyData.step08Data = templateData.step08Data as Prisma.InputJsonValue;
      }
      if (templateData.step09Data) {
        policyData.step09Data = templateData.step09Data as Prisma.InputJsonValue;
      }
      if (templateData.step10Data) {
        policyData.step10Data = templateData.step10Data as Prisma.InputJsonValue;
      }
      if (templateData.step11Data) {
        policyData.step11Data = templateData.step11Data as Prisma.InputJsonValue;
      }
      if (templateData.step12Data) {
        policyData.step12Data = templateData.step12Data as Prisma.InputJsonValue;
      }
    }

    const policy = await prisma.policy.create({
      data: policyData,
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "POLICY_CREATED",
        resource: "policy",
        resourceId: policy.id,
        details: { name, templateId: templateId || null },
      },
    });

    return NextResponse.json(policy, { status: 201 });
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
