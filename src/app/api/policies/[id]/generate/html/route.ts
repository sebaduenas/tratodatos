import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateHTMLDocument } from "@/lib/document-generator/html-document";
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
        { error: "La política debe estar completa para generar el HTML" },
        { status: 400 }
      );
    }

    const includeWatermark = policy.user.subscriptionTier === "FREE";

    // Generate HTML
    const htmlContent = generateHTMLDocument({
      policy: policy as unknown as Policy,
      includeWatermark,
    });

    // Record download
    await prisma.policyDownload.create({
      data: {
        policyId: id,
        format: "html",
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
        details: { format: "html", includeWatermark },
      },
    });

    // Return HTML
    const filename = `politica-datos-${policy.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")}.html`;

    return new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error generating HTML:", error);
    return NextResponse.json(
      { error: "Error al generar el HTML" },
      { status: 500 }
    );
  }
}
