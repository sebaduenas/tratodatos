import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// GET - Get specific version
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; versionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id, versionId } = params;

    // Verify policy belongs to user
    const policy = await prisma.policy.findFirst({
      where: { id, userId: session.user.id },
      select: { id: true },
    });

    if (!policy) {
      return NextResponse.json(
        { error: "Política no encontrada" },
        { status: 404 }
      );
    }

    const version = await prisma.policyVersion.findUnique({
      where: { id: versionId, policyId: id },
    });

    if (!version) {
      return NextResponse.json(
        { error: "Versión no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(version);
  } catch (error) {
    console.error("Error fetching version:", error);
    return NextResponse.json(
      { error: "Error al obtener versión" },
      { status: 500 }
    );
  }
}

// POST - Restore this version
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; versionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id, versionId } = params;

    // Verify policy belongs to user
    const policy = await prisma.policy.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!policy) {
      return NextResponse.json(
        { error: "Política no encontrada" },
        { status: 404 }
      );
    }

    // Get version to restore
    const version = await prisma.policyVersion.findUnique({
      where: { id: versionId, policyId: id },
    });

    if (!version) {
      return NextResponse.json(
        { error: "Versión no encontrada" },
        { status: 404 }
      );
    }

    const content = version.content as {
      step01Data?: unknown;
      step02Data?: unknown;
      step03Data?: unknown;
      step04Data?: unknown;
      step05Data?: unknown;
      step06Data?: unknown;
      step07Data?: unknown;
      step08Data?: unknown;
      step09Data?: unknown;
      step10Data?: unknown;
      step11Data?: unknown;
      step12Data?: unknown;
      completedSteps?: number[];
      completionPct?: number;
    };

    // First, create a backup of current state
    await prisma.policyVersion.create({
      data: {
        policyId: id,
        version: policy.version,
        content: {
          step01Data: policy.step01Data,
          step02Data: policy.step02Data,
          step03Data: policy.step03Data,
          step04Data: policy.step04Data,
          step05Data: policy.step05Data,
          step06Data: policy.step06Data,
          step07Data: policy.step07Data,
          step08Data: policy.step08Data,
          step09Data: policy.step09Data,
          step10Data: policy.step10Data,
          step11Data: policy.step11Data,
          step12Data: policy.step12Data,
          completedSteps: policy.completedSteps,
          completionPct: policy.completionPct,
        },
        changeNotes: `Backup antes de restaurar versión ${version.version}`,
        changedBy: session.user.id,
      },
    });

    // Restore the policy to the selected version
    await prisma.policy.update({
      where: { id },
      data: {
        step01Data: content.step01Data as Prisma.InputJsonValue,
        step02Data: content.step02Data as Prisma.InputJsonValue,
        step03Data: content.step03Data as Prisma.InputJsonValue,
        step04Data: content.step04Data as Prisma.InputJsonValue,
        step05Data: content.step05Data as Prisma.InputJsonValue,
        step06Data: content.step06Data as Prisma.InputJsonValue,
        step07Data: content.step07Data as Prisma.InputJsonValue,
        step08Data: content.step08Data as Prisma.InputJsonValue,
        step09Data: content.step09Data as Prisma.InputJsonValue,
        step10Data: content.step10Data as Prisma.InputJsonValue,
        step11Data: content.step11Data as Prisma.InputJsonValue,
        step12Data: content.step12Data as Prisma.InputJsonValue,
        completedSteps: content.completedSteps || [],
        completionPct: content.completionPct || 0,
        version: policy.version + 1,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "POLICY_VERSION_RESTORED",
        resource: "policy",
        resourceId: id,
        details: { restoredVersion: version.version, newVersion: policy.version + 1 },
      },
    });

    return NextResponse.json({ success: true, newVersion: policy.version + 1 });
  } catch (error) {
    console.error("Error restoring version:", error);
    return NextResponse.json(
      { error: "Error al restaurar versión" },
      { status: 500 }
    );
  }
}
