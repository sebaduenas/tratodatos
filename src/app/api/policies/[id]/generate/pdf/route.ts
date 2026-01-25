import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { renderToBuffer } from "@react-pdf/renderer";
import { PolicyPDFDocument } from "@/lib/document-generator/pdf-document";
import type { Policy } from "@/types/policy";

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
        { error: "La política debe estar completa para generar el PDF" },
        { status: 400 }
      );
    }

    const includeWatermark = policy.user.subscriptionTier === "FREE";

    // Generate PDF using react-pdf
    const pdfBuffer = await renderToBuffer(
      PolicyPDFDocument({
        policy: policy as unknown as Policy,
        includeWatermark,
      })
    );

    // Record download
    await prisma.policyDownload.create({
      data: {
        policyId: id,
        format: "pdf",
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
        details: { format: "pdf", includeWatermark },
      },
    });

    // Return PDF
    const filename = `politica-datos-${policy.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")}.pdf`;

    // Convert Buffer to Uint8Array for NextResponse compatibility
    const uint8Array = new Uint8Array(pdfBuffer);

    return new NextResponse(uint8Array, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Error al generar el PDF" },
      { status: 500 }
    );
  }
}
