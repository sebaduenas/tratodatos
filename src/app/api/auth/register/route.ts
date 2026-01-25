import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { createVerificationToken } from "@/lib/tokens";
import { sendEmail, getVerificationEmailTemplate, generateVerificationUrl } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  companyName: z.string().optional().nullable().transform(val => val || undefined),
  utmSource: z.string().optional().nullable().transform(val => val || undefined),
  utmMedium: z.string().optional().nullable().transform(val => val || undefined),
  utmCampaign: z.string().optional().nullable().transform(val => val || undefined),
});

export async function POST(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = await rateLimit(request, "auth");
  if (!rateLimitResult.success && rateLimitResult.response) {
    return rateLimitResult.response;
  }

  try {
    const body = await request.json();
    const data = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con este email" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        name: data.name,
        passwordHash,
        companyName: data.companyName,
        utmSource: data.utmSource,
        utmMedium: data.utmMedium,
        utmCampaign: data.utmCampaign,
        acceptedTermsAt: new Date(),
        acceptedPrivacyAt: new Date(),
      },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "USER_REGISTERED",
        resource: "user",
        resourceId: user.id,
        details: {
          email: user.email,
          utmSource: data.utmSource,
        },
      },
    });

    // Send verification email (non-blocking)
    try {
      const token = await createVerificationToken(user.email);
      const verificationUrl = generateVerificationUrl(token);
      
      await sendEmail({
        to: user.email,
        subject: "Verifica tu email - TratoDatos",
        html: getVerificationEmailTemplate(user.name || "Usuario", verificationUrl),
      });
    } catch (emailError) {
      // Log error but don't fail registration
      console.error("Error sending verification email:", emailError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Cuenta creada exitosamente. Revisa tu email para verificar tu cuenta.",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Error al crear la cuenta" },
      { status: 500 }
    );
  }
}
