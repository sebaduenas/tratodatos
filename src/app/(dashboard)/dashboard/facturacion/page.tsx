"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  CreditCard,
  CheckCircle,
  Sparkles,
  Building2,
  Zap,
  FileText,
  Users,
  Download,
  Shield,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const plans = [
  {
    id: "FREE",
    name: "Gratuito",
    price: 0,
    description: "Para empezar",
    features: [
      { text: "1 política", icon: FileText },
      { text: "PDF con marca de agua", icon: Download },
      { text: "Formato HTML", icon: FileText },
    ],
    limits: {
      policies: 1,
      watermark: true,
      word: false,
      versioning: false,
    },
  },
  {
    id: "PROFESSIONAL",
    name: "Profesional",
    price: 9990,
    description: "Para PYMEs",
    popular: true,
    features: [
      { text: "5 políticas", icon: FileText },
      { text: "PDF sin marca de agua", icon: Download },
      { text: "Exportar a Word", icon: FileText },
      { text: "Versionamiento", icon: Shield },
    ],
    limits: {
      policies: 5,
      watermark: false,
      word: true,
      versioning: true,
    },
  },
  {
    id: "ENTERPRISE",
    name: "Empresa",
    price: 29990,
    description: "Para grandes empresas",
    features: [
      { text: "Políticas ilimitadas", icon: FileText },
      { text: "Multi-usuario", icon: Users },
      { text: "API de acceso", icon: Zap },
      { text: "Soporte dedicado", icon: Building2 },
    ],
    limits: {
      policies: 999,
      watermark: false,
      word: true,
      versioning: true,
      multiUser: true,
      api: true,
    },
  },
];

export default function FacturacionPage() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const currentPlan = session?.user?.subscriptionTier || "FREE";

  const handleSelectPlan = async (planId: string) => {
    if (planId === currentPlan) return;

    // Free plan - instant downgrade
    if (planId === "FREE") {
      if (
        !confirm(
          "¿Estás seguro de cambiar al plan gratuito? Perderás acceso a funciones premium."
        )
      ) {
        return;
      }

      setIsLoading(planId);
      try {
        const response = await fetch("/api/user/subscription", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tier: planId }),
        });

        if (!response.ok) throw new Error("Error al cambiar plan");

        await update({ subscriptionTier: planId });
        toast.success("Plan actualizado correctamente");
      } catch (error) {
        toast.error("Error al cambiar el plan");
      } finally {
        setIsLoading(null);
      }
      return;
    }

    // Paid plans - show coming soon
    toast.info(
      "Los pagos estarán disponibles próximamente. Por ahora, puedes usar el plan gratuito.",
      { duration: 5000 }
    );
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("es-CL");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Facturación</h1>
        <p className="text-slate-600 mt-1">
          Gestiona tu plan y método de pago
        </p>
      </div>

      {/* Current Plan */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Tu Plan Actual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {plans.find((p) => p.id === currentPlan)?.name || "Gratuito"}
                </h3>
                <p className="text-slate-500">
                  {currentPlan === "FREE"
                    ? "Sin costo mensual"
                    : `$${formatPrice(
                        plans.find((p) => p.id === currentPlan)?.price || 0
                      )}/mes`}
                </p>
              </div>
            </div>
            {currentPlan !== "FREE" && (
              <Badge className="bg-green-100 text-green-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                Activo
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Planes Disponibles
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = plan.id === currentPlan;
          const isPopular = plan.popular;

          return (
            <Card
              key={plan.id}
              className={`relative ${
                isPopular
                  ? "border-indigo-300 ring-2 ring-indigo-100"
                  : isCurrentPlan
                  ? "border-green-300 bg-green-50/50"
                  : ""
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-indigo-600">Más popular</Badge>
                </div>
              )}

              <CardHeader className="pb-4">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="pt-2">
                  <span className="text-4xl font-bold text-slate-900">
                    ${formatPrice(plan.price)}
                  </span>
                  <span className="text-slate-500">/mes</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-3 h-3 text-indigo-600" />
                      </div>
                      <span className="text-slate-600">{feature.text}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    isCurrentPlan
                      ? "bg-green-600 hover:bg-green-600 cursor-default"
                      : isPopular
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : ""
                  }`}
                  variant={isCurrentPlan || isPopular ? "default" : "outline"}
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isCurrentPlan || isLoading === plan.id}
                >
                  {isLoading === plan.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : isCurrentPlan ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Plan actual
                    </>
                  ) : plan.price === 0 ? (
                    "Cambiar a Gratuito"
                  ) : (
                    "Seleccionar plan"
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Payment Info */}
      <Card className="mt-8">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">
                Pagos próximamente
              </h3>
              <p className="text-slate-600 text-sm">
                Estamos trabajando en integrar métodos de pago seguros. Por
                ahora, puedes usar todas las funcionalidades del plan gratuito.
                Te notificaremos cuando los pagos estén disponibles.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <div className="mt-8 p-6 bg-slate-50 rounded-xl">
        <h3 className="font-semibold text-slate-900 mb-4">
          Preguntas Frecuentes
        </h3>
        <div className="space-y-4 text-sm">
          <div>
            <p className="font-medium text-slate-900">
              ¿Puedo cambiar de plan en cualquier momento?
            </p>
            <p className="text-slate-600">
              Sí, puedes cambiar de plan cuando quieras. Los cambios se aplican
              inmediatamente.
            </p>
          </div>
          <div>
            <p className="font-medium text-slate-900">
              ¿Qué pasa con mis políticas si bajo de plan?
            </p>
            <p className="text-slate-600">
              Tus políticas existentes se mantienen, pero no podrás crear nuevas
              si superas el límite de tu nuevo plan.
            </p>
          </div>
          <div>
            <p className="font-medium text-slate-900">
              ¿Ofrecen factura electrónica?
            </p>
            <p className="text-slate-600">
              Sí, todas las transacciones incluyen boleta o factura electrónica
              según corresponda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
