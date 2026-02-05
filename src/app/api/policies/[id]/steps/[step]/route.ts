import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/policies/[id]/steps/[step] - Save step data
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; step: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id, step } = await params;
    const stepNumber = parseInt(step, 10);

    if (isNaN(stepNumber) || stepNumber < 1 || stepNumber > 12) {
      return NextResponse.json({ error: "Paso inválido" }, { status: 400 });
    }

    // Verify policy ownership
    const policy = await prisma.policy.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!policy) {
      return NextResponse.json(
        { error: "Política no encontrada" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const stepField = `step${String(stepNumber).padStart(2, "0")}Data` as const;

    // Update completed steps
    const completedSteps = policy.completedSteps.includes(stepNumber)
      ? policy.completedSteps
      : [...policy.completedSteps, stepNumber].sort((a, b) => a - b);

    const completionPct = Math.round((completedSteps.length / 12) * 100);

    // Update status
    let status = policy.status;
    if (status === "DRAFT" && completedSteps.length > 0) status = "IN_PROGRESS";
    if (completedSteps.length === 12) status = "COMPLETED";

    const updatedPolicy = await prisma.policy.update({
      where: { id },
      data: {
        [stepField]: body.data,
        completedSteps,
        completionPct,
        currentStep: Math.min(stepNumber + 1, 12),
        status,
      },
    });

    return NextResponse.json({
      success: true,
      policy: {
        id: updatedPolicy.id,
        currentStep: updatedPolicy.currentStep,
        completedSteps: updatedPolicy.completedSteps,
        completionPct: updatedPolicy.completionPct,
        status: updatedPolicy.status,
      },
    });
  } catch (error) {
    console.error("Error saving step:", error);
    const msg = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: `Error al guardar paso: ${msg}` }, { status: 500 });
  }
}
