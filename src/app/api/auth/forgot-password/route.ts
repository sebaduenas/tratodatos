// API route para solicitar recuperación de contraseña
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPasswordResetToken } from "@/lib/tokens";
import { sendEmail, getPasswordResetEmailTemplate, generatePasswordResetUrl } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  // Rate limiting - stricter for password reset
  const rateLimitResult = await rateLimit(request, "auth");
  if (!rateLimitResult.success && rateLimitResult.response) {
    return rateLimitResult.response;
  }

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email es requerido" },
        { status: 400 }
      );
    }

    // Find user (don't reveal if user exists)
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success for security (don't reveal if email exists)
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "Si el email existe, recibirás un enlace para restablecer tu contraseña",
      });
    }

    // Create reset token
    const token = await createPasswordResetToken(email.toLowerCase());
    const resetUrl = generatePasswordResetUrl(token);

    // Send email
    await sendEmail({
      to: email,
      subject: "Recupera tu contraseña - TratoDatos",
      html: getPasswordResetEmailTemplate(user.name || "Usuario", resetUrl),
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "PASSWORD_RESET_REQUESTED",
        resource: "user",
        resourceId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Si el email existe, recibirás un enlace para restablecer tu contraseña",
    });
  } catch (error) {
    console.error("Error in forgot password:", error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
