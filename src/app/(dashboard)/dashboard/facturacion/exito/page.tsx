"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { update: updateSession } = useSession();
  const [isUpdating, setIsUpdating] = useState(true);
  const paymentId = searchParams.get("payment_id");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!paymentId) {
        setIsUpdating(false);
        return;
      }

      try {
        // El webhook ya habrá actualizado el estado, pero refrescamos la sesión
        await updateSession();
      } catch (error) {
        console.error("Error updating session:", error);
      } finally {
        setIsUpdating(false);
      }
    };

    verifyPayment();
  }, [paymentId, updateSession]);

  return (
    <div className="container mx-auto px-4 py-16 max-w-lg">
      <Card className="text-center">
        <CardHeader>
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            {isUpdating ? (
              <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
            ) : (
              <CheckCircle className="w-8 h-8 text-green-600" />
            )}
          </div>
          <CardTitle className="text-2xl">¡Pago Exitoso!</CardTitle>
          <CardDescription>
            Tu suscripción ha sido activada correctamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-slate-600">
            Gracias por confiar en TratoDatos. Tu plan ha sido actualizado y ya puedes disfrutar de todas las funcionalidades.
          </p>
          
          <div className="flex flex-col gap-3">
            <Link href="/dashboard">
              <Button className="w-full gap-2 bg-gradient-to-r from-indigo-600 to-violet-600">
                Ir al Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/dashboard/facturacion">
              <Button variant="outline" className="w-full">
                Ver mi suscripción
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
