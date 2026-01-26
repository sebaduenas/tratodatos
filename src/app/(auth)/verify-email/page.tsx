"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Shield, CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

type VerificationStatus = "loading" | "success" | "error" | "no-token";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<VerificationStatus>(
    token ? "loading" : "no-token"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return;

    const verifyEmail = async () => {
      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message);
        } else {
          setStatus("error");
          setMessage(data.error || "Error al verificar el email");
        }
      } catch {
        setStatus("error");
        setMessage("Error de conexión. Intenta nuevamente.");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </Link>
          </div>

          {status === "loading" && (
            <>
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-2">
                Verificando tu email...
              </h1>
              <p className="text-slate-500">
                Por favor espera un momento.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-2">
                ¡Email verificado!
              </h1>
              <p className="text-slate-500 mb-6">
                {message || "Tu cuenta ha sido verificada correctamente."}
              </p>
              <Link href="/login">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 rounded-full">
                  Iniciar sesión
                </Button>
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-2">
                Error de verificación
              </h1>
              <p className="text-slate-500 mb-6">
                {message || "El enlace es inválido o ha expirado."}
              </p>
              <div className="space-y-3">
                <Link href="/login">
                  <Button variant="outline" className="w-full rounded-full">
                    Ir al inicio de sesión
                  </Button>
                </Link>
              </div>
            </>
          )}

          {status === "no-token" && (
            <>
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-amber-600" />
              </div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-2">
                Verifica tu email
              </h1>
              <p className="text-slate-500 mb-6">
                Revisa tu bandeja de entrada y haz clic en el enlace de verificación que te enviamos.
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full rounded-full">
                  Volver al inicio
                </Button>
              </Link>
            </>
          )}
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          ¿Necesitas ayuda?{" "}
          <a href="mailto:contacto@tratodatos.cl" className="text-blue-600 hover:underline">
            Contáctanos
          </a>
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
