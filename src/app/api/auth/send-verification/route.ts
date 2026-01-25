// API route para enviar email de verificación
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createVerificationToken } from "@/lib/tokens";
import { sendEmail, getVerificationEmailTemplate, generateVerificationUrl } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  // Rate limiting
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

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Return success even if user doesn't exist (security)
      return NextResponse.json({
        success: true,
        message: "Si el email existe, recibirás un enlace de verificación",
      });
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        message: "Tu email ya está verificado",
      });
    }

    // Create verification token
    const token = await createVerificationToken(email.toLowerCase());
    const verificationUrl = generateVerificationUrl(token);

    // Send email
    await sendEmail({
      to: email,
      subject: "Verifica tu email - TratoDatos",
      html: getVerificationEmailTemplate(user.name || "Usuario", verificationUrl),
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "VERIFICATION_EMAIL_SENT",
        resource: "user",
        resourceId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Email de verificación enviado",
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    return NextResponse.json(
      { error: "Error al enviar el email de verificación" },
      { status: 500 }
    );
  }
}
