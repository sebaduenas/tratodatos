"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Shield, Mail, Loader2, CheckCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function VerificacionPendientePage() {
  const { data: session, update } = useSession();
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      const response = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session?.user?.email }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar email");
      }

      toast.success("Email de verificación enviado. Revisa tu bandeja de entrada.");
    } catch (error) {
      toast.error("Error al enviar el email de verificación");
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    setIsChecking(true);
    try {
      // Force session update to check if email was verified
      await update();
      
      // Small delay to let the session update
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Check if now verified
      if (session?.user?.emailVerified) {
        toast.success("¡Email verificado! Redirigiendo...");
        window.location.href = "/dashboard";
      } else {
        toast.info("Tu email aún no ha sido verificado");
      }
    } catch (error) {
      toast.error("Error al verificar el estado");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-xl text-slate-900">TratoDatos</span>
          </Link>

          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-amber-600" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Verifica tu email
          </h1>
          
          <p className="text-slate-600 mb-6">
            Te enviamos un email de verificación a{" "}
            <span className="font-medium text-slate-900">
              {session?.user?.email}
            </span>
            . Por favor, revisa tu bandeja de entrada y haz clic en el enlace
            para continuar.
          </p>

          <div className="space-y-3">
            <Button
              onClick={handleCheckVerification}
              disabled={isChecking}
              className="w-full gap-2"
            >
              {isChecking ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Ya verifiqué mi email
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleResendEmail}
              disabled={isResending}
              className="w-full gap-2"
            >
              {isResending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Reenviar email
                </>
              )}
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-sm text-slate-500 mb-3">
              ¿No recibiste el email? Revisa tu carpeta de spam.
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-slate-500"
            >
              Cerrar sesión
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
