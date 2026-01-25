import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - List all versions of a policy
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const policy = await prisma.policy.findFirst({
      where: { id, userId: session.user.id },
      include: { user: { select: { subscriptionTier: true } } },
    });

    if (!policy) {
      return NextResponse.json(
        { error: "Política no encontrada" },
        { status: 404 }
      );
    }

    // Check if user has access to versioning (Professional or Enterprise)
    if (policy.user.subscriptionTier === "FREE") {
      return NextResponse.json(
        { error: "El versionamiento está disponible solo para planes Professional y Enterprise" },
        { status: 403 }
      );
    }

    const versions = await prisma.policyVersion.findMany({
      where: { policyId: id },
      orderBy: { version: "desc" },
      select: {
        id: true,
        version: true,
        changeNotes: true,
        changedBy: true,
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

// POST - Create a new version (snapshot current policy)
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
    const body = await request.json();
    const { changeNotes } = body;

    // Verify ownership and get policy
    const policy = await prisma.policy.findFirst({
      where: { id, userId: session.user.id },
      include: { user: { select: { subscriptionTier: true } } },
    });

    if (!policy) {
      return NextResponse.json(
        { error: "Política no encontrada" },
        { status: 404 }
      );
    }

    // Check if user has access to versioning
    if (policy.user.subscriptionTier === "FREE") {
      return NextResponse.json(
        { error: "El versionamiento está disponible solo para planes Professional y Enterprise" },
        { status: 403 }
      );
    }

    // Create snapshot of current policy data
    const policyContent = {
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
    };

    // Create new version
    const newVersion = await prisma.policyVersion.create({
      data: {
        policyId: id,
        version: policy.version,
        content: policyContent,
        changeNotes: changeNotes || `Versión ${policy.version}`,
        changedBy: session.user.name || session.user.email,
      },
    });

    // Increment policy version
    await prisma.policy.update({
      where: { id },
      data: { version: { increment: 1 } },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "POLICY_VERSION_CREATED",
        resource: "policy_version",
        resourceId: newVersion.id,
        details: { policyId: id, version: policy.version, changeNotes },
      },
    });

    return NextResponse.json({
      success: true,
      version: newVersion,
    });
  } catch (error) {
    console.error("Error creating version:", error);
    return NextResponse.json(
      { error: "Error al crear versión" },
      { status: 500 }
    );
  }
}
