import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
        { error: "La política debe estar completa para generar el PDF" },
        { status: 400 }
      );
    }

    // For now, generate a simple HTML response
    // In production, you would use @react-pdf/renderer
    const includeWatermark = policy.user.subscriptionTier === "FREE";

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

    // Generate HTML for PDF (simplified version)
    const html = generatePolicyHTML(policy, includeWatermark);

    // Return HTML for now - in production use react-pdf
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="politica-datos-${policy.name
          .toLowerCase()
          .replace(/\s+/g, "-")}.html"`,
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

function generatePolicyHTML(policy: any, includeWatermark: boolean): string {
  const step01 = policy.step01Data as any;
  const step12 = policy.step12Data as any;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Política de Tratamiento de Datos - ${step01?.companyName || "Empresa"}</title>
  <style>
    body {
      font-family: Georgia, serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
      line-height: 1.6;
      color: #333;
    }
    h1 {
      text-align: center;
      font-size: 24px;
      border-bottom: 2px solid #333;
      padding-bottom: 20px;
    }
    h2 {
      font-size: 18px;
      margin-top: 30px;
      color: #1a1a1a;
    }
    .company-info {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 12px;
      color: #666;
    }
    ${
      includeWatermark
        ? `
    .watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 100px;
      color: rgba(0,0,0,0.05);
      pointer-events: none;
      z-index: -1;
    }
    `
        : ""
    }
  </style>
</head>
<body>
  ${includeWatermark ? '<div class="watermark">TratoDatos</div>' : ""}
  
  <h1>POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES</h1>
  <p style="text-align: center; font-size: 18px;">${step01?.companyName || "Empresa"}</p>
  ${step12?.effectiveDate ? `<p style="text-align: center;">Vigente desde: ${step12.effectiveDate}</p>` : ""}

  <h2>1. IDENTIFICACIÓN DEL RESPONSABLE</h2>
  ${
    step01
      ? `
  <div class="company-info">
    <p><strong>Razón Social:</strong> ${step01.companyName}</p>
    <p><strong>RUT:</strong> ${step01.rut}</p>
    <p><strong>Dirección:</strong> ${step01.address}, ${step01.city}</p>
    <p><strong>Teléfono:</strong> ${step01.phone}</p>
    <p><strong>Email:</strong> ${step01.email}</p>
    ${step01.website ? `<p><strong>Sitio Web:</strong> ${step01.website}</p>` : ""}
  </div>
  `
      : ""
  }

  <h2>2. DERECHOS DEL TITULAR</h2>
  <p>De acuerdo con la Ley N° 19.628, modificada por la Ley N° 21.719, usted tiene los siguientes derechos:</p>
  <ul>
    <li><strong>Derecho de Acceso:</strong> Solicitar confirmación sobre si sus datos están siendo tratados.</li>
    <li><strong>Derecho de Rectificación:</strong> Solicitar la rectificación de datos inexactos.</li>
    <li><strong>Derecho de Cancelación:</strong> Solicitar la supresión de sus datos.</li>
    <li><strong>Derecho de Oposición:</strong> Oponerse al tratamiento en determinadas circunstancias.</li>
  </ul>

  ${
    step12
      ? `
  <h2>3. CONTACTO</h2>
  <p>Para ejercer sus derechos, contacte a:</p>
  <div class="company-info">
    <p><strong>Canal:</strong> ${step12.contactChannel}</p>
    <p><strong>Responsable:</strong> ${step12.responsiblePerson}</p>
    <p><strong>Plazo de respuesta:</strong> ${step12.responseTime} días hábiles</p>
  </div>
  `
      : ""
  }

  <div class="footer">
    <p><strong>AVISO LEGAL</strong></p>
    <p>Este documento ha sido generado mediante la plataforma TratoDatos (tratodatos.cl) como herramienta de apoyo para el cumplimiento de las obligaciones establecidas en la Ley N° 19.628, modificada por la Ley N° 21.719.</p>
    <p>Este documento NO constituye asesoría legal.</p>
    ${includeWatermark ? "<p><em>Documento generado con el plan gratuito de TratoDatos</em></p>" : ""}
  </div>
</body>
</html>
  `;
}
