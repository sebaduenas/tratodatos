import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// POST - Generate share link
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = params;

    const policy = await prisma.policy.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!policy) {
      return NextResponse.json(
        { error: "Política no encontrada" },
        { status: 404 }
      );
    }

    if (policy.completionPct < 100) {
      return NextResponse.json(
        { error: "La política debe estar completa para compartir" },
        { status: 400 }
      );
    }

    // Generate share token if not exists
    let shareToken = policy.shareToken;
    
    if (!shareToken) {
      shareToken = crypto.randomBytes(16).toString("hex");
      
      await prisma.policy.update({
        where: { id },
        data: {
          shareToken,
          isPublic: true,
        },
      });
    }

    const shareUrl = `${process.env.NEXTAUTH_URL}/politica/${shareToken}`;

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "POLICY_SHARED",
        resource: "policy",
        resourceId: id,
        details: { shareToken },
      },
    });

    return NextResponse.json({
      shareUrl,
      shareToken,
      isPublic: true,
    });
  } catch (error) {
    console.error("Error sharing policy:", error);
    return NextResponse.json(
      { error: "Error al compartir" },
      { status: 500 }
    );
  }
}

// DELETE - Revoke share link
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = params;

    await prisma.policy.update({
      where: { id, userId: session.user.id },
      data: {
        shareToken: null,
        isPublic: false,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error revoking share:", error);
    return NextResponse.json(
      { error: "Error al revocar" },
      { status: 500 }
    );
  }
}
