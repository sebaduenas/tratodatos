import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - List all versions of a policy
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = params;

    // Verify policy belongs to user
    const policy = await prisma.policy.findFirst({
      where: { id, userId: session.user.id },
      select: { id: true, version: true },
    });

    if (!policy) {
      return NextResponse.json(
        { error: "Política no encontrada" },
        { status: 404 }
      );
    }

    const versions = await prisma.policyVersion.findMany({
      where: { policyId: id },
      orderBy: { version: "desc" },
      select: {
        id: true,
        version: true,
        changeNotes: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      currentVersion: policy.version,
      versions,
    });
  } catch (error) {
    console.error("Error fetching versions:", error);
    return NextResponse.json(
      { error: "Error al obtener versiones" },
      { status: 500 }
    );
  }
}

// POST - Create a new version (snapshot)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = params;
    const { changeNotes } = await request.json();

    // Get current policy
    const policy = await prisma.policy.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!policy) {
      return NextResponse.json(
        { error: "Política no encontrada" },
        { status: 404 }
      );
    }

    // Create version snapshot
    const version = await prisma.policyVersion.create({
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
        changeNotes: changeNotes || `Versión ${policy.version}`,
        changedBy: session.user.id,
      },
    });

    // Increment policy version
    await prisma.policy.update({
      where: { id },
      data: { version: policy.version + 1 },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "POLICY_VERSION_CREATED",
        resource: "policy",
        resourceId: id,
        details: { version: policy.version, changeNotes },
      },
    });

    return NextResponse.json(version, { status: 201 });
  } catch (error) {
    console.error("Error creating version:", error);
    return NextResponse.json(
      { error: "Error al crear versión" },
      { status: 500 }
    );
  }
}
