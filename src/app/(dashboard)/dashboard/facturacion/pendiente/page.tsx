"use client";

import Link from "next/link";
import { Clock, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentPendingPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-lg">
      <Card className="text-center">
        <CardHeader>
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-amber-600" />
          </div>
          <CardTitle className="text-2xl">Pago Pendiente</CardTitle>
          <CardDescription>
            Estamos procesando tu pago
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-slate-600">
            Tu pago está siendo procesado. Esto puede tomar unos minutos. 
            Te notificaremos por email cuando se complete.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <h4 className="font-medium text-blue-800 mb-2">Información importante</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• El proceso puede tomar hasta 24 horas en algunos casos</li>
              <li>• Recibirás un email de confirmación cuando se apruebe</li>
              <li>• No realices otro pago mientras este está pendiente</li>
            </ul>
          </div>
          
          <div className="flex flex-col gap-3">
            <Link href="/dashboard/facturacion">
              <Button className="w-full gap-2">
                <RefreshCw className="w-4 h-4" />
                Verificar estado
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
