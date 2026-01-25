"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CreditCard, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

export default function SimulatePaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const paymentId = searchParams.get("paymentId");
  const plan = searchParams.get("plan");
  const amount = searchParams.get("amount");

  const formatPrice = (price: string | null) => {
    if (!price) return "$0";
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(parseInt(price));
  };

  const handleSimulatePayment = async (success: boolean) => {
    setIsProcessing(true);
    
    try {
      // Simular delay de procesamiento
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      if (success && paymentId) {
        // Llamar API para marcar como completado (modo desarrollo)
        const response = await fetch("/api/payments/simulate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId, success: true }),
        });

        if (!response.ok) {
          throw new Error("Error al procesar pago simulado");
        }

        router.push(`/dashboard/facturacion/exito?payment_id=${paymentId}`);
      } else {
        router.push(`/dashboard/facturacion/error?payment_id=${paymentId}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al procesar");
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-lg">
      <Alert className="mb-6 border-amber-300 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Modo Desarrollo</AlertTitle>
        <AlertDescription className="text-amber-700">
          Esta es una simulación de pago. En producción, serás redirigido a MercadoPago.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <CardTitle>Simular Pago</CardTitle>
              <CardDescription>
                Plan {plan === "PROFESSIONAL" ? "Profesional" : "Empresa"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500">Total a pagar</p>
            <p className="text-3xl font-bold text-slate-900">{formatPrice(amount)}</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Número de tarjeta</Label>
              <Input placeholder="4242 4242 4242 4242" disabled={isProcessing} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Vencimiento</Label>
                <Input placeholder="MM/AA" disabled={isProcessing} />
              </div>
              <div className="space-y-2">
                <Label>CVV</Label>
                <Input placeholder="123" disabled={isProcessing} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600"
              onClick={() => handleSimulatePayment(true)}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                "Simular Pago Exitoso"
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => handleSimulatePayment(false)}
              disabled={isProcessing}
            >
              Simular Pago Fallido
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
