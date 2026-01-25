"use client";

import Link from "next/link";
import { XCircle, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentErrorPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-lg">
      <Card className="text-center">
        <CardHeader>
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Error en el Pago</CardTitle>
          <CardDescription>
            No pudimos procesar tu pago
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-slate-600">
            Hubo un problema al procesar tu pago. Esto puede deberse a fondos insuficientes, 
            tarjeta expirada o un problema temporal con el procesador de pagos.
          </p>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left">
            <h4 className="font-medium text-amber-800 mb-2">¿Qué puedes hacer?</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Verifica que tu tarjeta tenga fondos suficientes</li>
              <li>• Comprueba que los datos de la tarjeta sean correctos</li>
              <li>• Intenta con otro método de pago</li>
              <li>• Si el problema persiste, contáctanos</li>
            </ul>
          </div>
          
          <div className="flex flex-col gap-3">
            <Link href="/dashboard/facturacion">
              <Button className="w-full gap-2">
                <RefreshCw className="w-4 h-4" />
                Intentar de nuevo
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full gap-2">
                Volver al Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
