import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Delete all user data in order (respecting foreign keys)
    await prisma.$transaction(async (tx) => {
      // Delete policy downloads
      await tx.policyDownload.deleteMany({
        where: { policy: { userId: session.user.id } },
      });

      // Delete policy versions
      await tx.policyVersion.deleteMany({
        where: { policy: { userId: session.user.id } },
      });

      // Delete policies
      await tx.policy.deleteMany({
        where: { userId: session.user.id },
      });

      // Delete audit logs
      await tx.auditLog.deleteMany({
        where: { userId: session.user.id },
      });

      // Delete payments
      await tx.payment.deleteMany({
        where: { userId: session.user.id },
      });

      // Delete sessions
      await tx.session.deleteMany({
        where: { userId: session.user.id },
      });

      // Delete accounts (OAuth)
      await tx.account.deleteMany({
        where: { userId: session.user.id },
      });

      // Finally, delete the user
      await tx.user.delete({
        where: { id: session.user.id },
      });
    });

    return NextResponse.json({ message: "Cuenta eliminada correctamente" });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Error al eliminar la cuenta" },
      { status: 500 }
    );
  }
}
