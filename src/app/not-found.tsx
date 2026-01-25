"use client";

import Link from "next/link";
import { Shield, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-xl text-slate-900">TratoDatos</span>
        </Link>

        {/* 404 Number */}
        <div className="text-[150px] font-bold text-slate-100 leading-none select-none">
          404
        </div>

        <h1 className="text-2xl font-semibold text-slate-900 mb-2 -mt-8">
          Página no encontrada
        </h1>
        <p className="text-slate-500 mb-8">
          La página que buscas no existe o ha sido movida.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
              <Home className="w-4 h-4" />
              Ir al inicio
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => typeof window !== "undefined" && window.history.back()}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver atrás
          </Button>
        </div>
      </div>
    </div>
  );
}
