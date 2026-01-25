import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    // Get query params for filtering
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const tier = searchParams.get("tier");

    // Build filter
    const where: any = {};
    if (startDate) {
      where.createdAt = { ...where.createdAt, gte: new Date(startDate) };
    }
    if (endDate) {
      where.createdAt = { ...where.createdAt, lte: new Date(endDate) };
    }
    if (tier && tier !== "ALL") {
      where.subscriptionTier = tier;
    }

    // Fetch users
    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        companyName: true,
        companyRut: true,
        phone: true,
        subscriptionTier: true,
        role: true,
        createdAt: true,
        lastLoginAt: true,
        loginCount: true,
        utmSource: true,
        utmMedium: true,
        utmCampaign: true,
        marketingConsent: true,
        _count: { select: { policies: true } },
      },
    });

    // Generate CSV
    const csvHeaders = [
      "ID",
      "Email",
      "Nombre",
      "Empresa",
      "RUT Empresa",
      "Teléfono",
      "Plan",
      "Rol",
      "Fecha Registro",
      "Último Login",
      "Cantidad Logins",
      "Cantidad Políticas",
      "UTM Source",
      "UTM Medium",
      "UTM Campaign",
      "Acepta Marketing",
    ].join(",");

    const csvRows = users.map((user) =>
      [
        user.id,
        user.email,
        escapeCSV(user.name || ""),
        escapeCSV(user.companyName || ""),
        user.companyRut || "",
        user.phone || "",
        user.subscriptionTier,
        user.role,
        user.createdAt ? format(user.createdAt, "yyyy-MM-dd HH:mm:ss") : "",
        user.lastLoginAt ? format(user.lastLoginAt, "yyyy-MM-dd HH:mm:ss") : "",
        user.loginCount,
        user._count.policies,
        user.utmSource || "",
        user.utmMedium || "",
        user.utmCampaign || "",
        user.marketingConsent ? "Sí" : "No",
      ].join(",")
    );

    const csv = [csvHeaders, ...csvRows].join("\n");

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "ADMIN_EXPORT_USERS",
        resource: "user",
        details: {
          filters: { startDate, endDate, tier },
          totalExported: users.length,
        },
      },
    });

    // Return CSV file
    const filename = `usuarios-tratodatos-${format(new Date(), "yyyy-MM-dd")}.csv`;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error exporting users:", error);
    return NextResponse.json(
      { error: "Error al exportar usuarios" },
      { status: 500 }
    );
  }
}

// Helper to escape CSV values
function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
