import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, policyId, step, action, timeSpentSec, errorMessage } = body;

    // Validate required fields
    if (!sessionId || !step || !action) {
      return NextResponse.json(
        { error: "Campos requeridos faltantes" },
        { status: 400 }
      );
    }

    // Validate action
    const validActions = ["started", "completed", "abandoned", "error"];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: "Acción inválida" },
        { status: 400 }
      );
    }

    // Create analytics record
    await prisma.wizardAnalytics.create({
      data: {
        sessionId,
        policyId: policyId || null,
        step: parseInt(step),
        action,
        timeSpentSec: timeSpentSec ? parseInt(timeSpentSec) : null,
        errorMessage: errorMessage || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // Don't expose errors - analytics should not fail loudly
    console.error("Error recording analytics:", error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
