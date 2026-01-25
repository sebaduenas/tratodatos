import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateWordDocument } from "@/lib/document-generator/word-document";
import type { Policy } from "@/types/policy";

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

    const policy = await prisma.policy.findFirst({
      where: { id, userId: session.user.id },
      include: {
        user: { select: { subscriptionTier: true } },
      },
    });

    if (!policy) {
      return NextResponse.json(
        { error: "Política no encontrada" },
        { status: 404 }
      );
    }

    if (policy.completionPct < 100) {
      return NextResponse.json(
        { error: "La política debe estar completa para generar el documento" },
        { status: 400 }
      );
    }

    // Only Professional and Enterprise can download Word without watermark
    const includeWatermark = policy.user.subscriptionTier === "FREE";

    // Check if user has access to Word export
    if (policy.user.subscriptionTier === "FREE") {
      return NextResponse.json(
        { error: "La exportación a Word está disponible solo para planes Professional y Enterprise" },
        { status: 403 }
      );
    }

    // Generate Word document
    const docxBuffer = await generateWordDocument({
      policy: policy as unknown as Policy,
      includeWatermark,
    });

    // Record download
    await prisma.policyDownload.create({
      data: {
        policyId: id,
        format: "docx",
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "POLICY_DOWNLOADED",
        resource: "policy",
        resourceId: id,
        details: { format: "docx", includeWatermark },
      },
    });

    // Return Word document
    const filename = `politica-datos-${policy.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")}.docx`;

    // Convert Buffer to Uint8Array for NextResponse compatibility
    const uint8Array = new Uint8Array(docxBuffer);

    return new NextResponse(uint8Array, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": docxBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error generating Word document:", error);
    return NextResponse.json(
      { error: "Error al generar el documento Word" },
      { status: 500 }
    );
  }
}
