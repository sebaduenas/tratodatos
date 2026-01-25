"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
          Algo salió mal
        </h1>
        <p className="text-slate-500 mb-8">
          Hubo un error al cargar esta página. Por favor intenta nuevamente.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            variant="outline"
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reintentar
          </Button>
          <Link href="/">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
              <Home className="w-4 h-4" />
              Ir al inicio
            </Button>
          </Link>
        </div>

        {process.env.NODE_ENV === "development" && error.message && (
          <details className="mt-8 text-left">
            <summary className="text-sm text-slate-500 cursor-pointer hover:text-slate-700">
              Detalles técnicos (solo desarrollo)
            </summary>
            <pre className="mt-2 p-4 bg-slate-900 text-slate-100 rounded-lg text-xs overflow-auto">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
