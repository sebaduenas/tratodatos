"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  CreditCard,
  Check,
  Crown,
  Building2,
  Zap,
  Receipt,
  Download,
  Loader2,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { toast } from "sonner";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  description: string;
  createdAt: string;
  paidAt: string | null;
}

const plans = [
  {
    id: "FREE",
    name: "Gratuito",
    price: 0,
    yearlyPrice: 0,
    description: "Para empezar a cumplir con la ley",
    icon: Zap,
    features: [
      "1 política de datos",
      "Exportación PDF con marca de agua",
      "Soporte por email",
      "Actualizaciones básicas",
    ],
    limitations: [
      "Sin exportación Word",
      "Sin plantillas predefinidas",
    ],
  },
  {
    id: "PROFESSIONAL",
    name: "Profesional",
    price: 9990,
    yearlyPrice: 99900,
    description: "Para pequeñas y medianas empresas",
    icon: Crown,
    popular: true,
    features: [
      "5 políticas de datos",
      "Exportación PDF sin marca de agua",
      "Exportación Word",
      "Plantillas por industria",
      "Soporte prioritario",
      "Historial de versiones",
    ],
    limitations: [],
  },
  {
    id: "ENTERPRISE",
    name: "Empresa",
    price: 29990,
    yearlyPrice: 299900,
    description: "Para grandes organizaciones",
    icon: Building2,
    features: [
      "Políticas ilimitadas",
      "Todas las exportaciones",
      "Plantillas personalizadas",
      "Soporte dedicado 24/7",
      "API de integración",
      "Multi-usuario",
      "Auditoría avanzada",
      "Capacitación incluida",
    ],
    limitations: [],
  },
];

export default function BillingPage() {
  const { data: session, update: updateSession } = useSession();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const currentPlan = session?.user?.subscriptionTier || "FREE";

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch("/api/payments");
      if (response.ok) {
        const data = await response.json();
        setPayments(data.payments);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoadingPayments(false);
    }
  };

  const handleUpgrade = async (planId: string) => {
    if (planId === "FREE" || planId === currentPlan) return;

    setIsLoading(planId);
    try {
      const response = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId, period: billingPeriod }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al procesar");
      }

      if (data.mode === "development") {
        toast.info("Modo desarrollo: redirigiendo a simulación de pago");
      }

      // Redirigir al checkout
      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error("Error upgrading:", error);
      toast.error("Error al procesar el pago");
    } finally {
      setIsLoading(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge className="bg-green-100 text-green-700">Completado</Badge>;
      case "PENDING":
        return <Badge className="bg-amber-100 text-amber-700">Pendiente</Badge>;
      case "FAILED":
        return <Badge className="bg-red-100 text-red-700">Fallido</Badge>;
      case "REFUNDED":
        return <Badge className="bg-blue-100 text-blue-700">Reembolsado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Facturación</h1>
        <p className="text-slate-600 mt-1">
          Gestiona tu suscripción y revisa tu historial de pagos
        </p>
      </div>

      <Tabs defaultValue="planes" className="space-y-8">
        <TabsList>
          <TabsTrigger value="planes">Planes</TabsTrigger>
          <TabsTrigger value="historial">Historial de Pagos</TabsTrigger>
        </TabsList>

        {/* Tab: Planes */}
        <TabsContent value="planes" className="space-y-6">
          {/* Plan actual */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tu Plan Actual</CardTitle>
                  <CardDescription>
                    Información sobre tu suscripción activa
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  {plans.find((p) => p.id === currentPlan)?.name || "Gratuito"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  {(() => {
                    const plan = plans.find((p) => p.id === currentPlan);
                    const Icon = plan?.icon || Zap;
                    return <Icon className="w-6 h-6 text-indigo-600" />;
                  })()}
                </div>
                <div>
                  <p className="font-medium text-slate-900">
                    {plans.find((p) => p.id === currentPlan)?.description}
                  </p>
                  <p className="text-sm text-slate-500">
                    {currentPlan === "FREE"
                      ? "Sin fecha de renovación"
                      : "Se renueva automáticamente cada mes"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selector de periodo */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-4 p-1 bg-slate-100 rounded-lg">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingPeriod === "monthly"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Mensual
              </button>
              <button
                onClick={() => setBillingPeriod("yearly")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingPeriod === "yearly"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Anual
                <span className="ml-2 text-xs text-green-600 font-semibold">
                  -17%
                </span>
              </button>
            </div>
          </div>

          {/* Planes */}
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isCurrentPlan = plan.id === currentPlan;
              const price = billingPeriod === "monthly" ? plan.price : plan.yearlyPrice;
              const monthlyEquivalent = billingPeriod === "yearly" ? Math.round(plan.yearlyPrice / 12) : plan.price;

              return (
                <Card
                  key={plan.id}
                  className={`relative ${
                    plan.popular
                      ? "border-indigo-500 shadow-lg"
                      : isCurrentPlan
                      ? "border-green-500"
                      : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-indigo-600">Más Popular</Badge>
                    </div>
                  )}
                  {isCurrentPlan && (
                    <div className="absolute -top-3 right-4">
                      <Badge className="bg-green-600">Plan Actual</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          plan.popular
                            ? "bg-indigo-100"
                            : "bg-slate-100"
                        }`}
                      >
                        <plan.icon
                          className={`w-5 h-5 ${
                            plan.popular ? "text-indigo-600" : "text-slate-600"
                          }`}
                        />
                      </div>
                      <CardTitle>{plan.name}</CardTitle>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-slate-900">
                        {formatPrice(monthlyEquivalent)}
                      </span>
                      <span className="text-slate-500">/mes</span>
                      {billingPeriod === "yearly" && price > 0 && (
                        <p className="text-sm text-slate-500 mt-1">
                          {formatPrice(price)} facturado anualmente
                        </p>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-600">{feature}</span>
                        </li>
                      ))}
                      {plan.limitations.map((limitation, idx) => (
                        <li
                          key={`lim-${idx}`}
                          className="flex items-start gap-2 text-slate-400"
                        >
                          <span className="w-5 h-5 shrink-0 mt-0.5 text-center">—</span>
                          <span className="text-sm">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
                          : ""
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                      disabled={isCurrentPlan || isLoading !== null}
                      onClick={() => handleUpgrade(plan.id)}
                    >
                      {isLoading === plan.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Procesando...
                        </>
                      ) : isCurrentPlan ? (
                        "Plan Actual"
                      ) : plan.id === "FREE" ? (
                        "Plan Gratuito"
                      ) : (
                        "Actualizar"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {/* Info de pago */}
          <Alert>
            <CreditCard className="h-4 w-4" />
            <AlertTitle>Métodos de pago</AlertTitle>
            <AlertDescription>
              Aceptamos tarjetas de crédito, débito y transferencias bancarias a través de MercadoPago.
              Todos los pagos son seguros y encriptados.
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Tab: Historial */}
        <TabsContent value="historial" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="w-5 h-5" />
                    Historial de Pagos
                  </CardTitle>
                  <CardDescription>
                    Revisa todos tus pagos anteriores
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loadingPayments ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                </div>
              ) : payments.length === 0 ? (
                <div className="text-center py-8">
                  <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No tienes pagos registrados</p>
                  <p className="text-sm text-slate-400 mt-1">
                    Los pagos aparecerán aquí cuando actualices tu plan
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Monto</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            {formatDate(payment.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>{payment.description}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatPrice(payment.amount)}
                        </TableCell>
                        <TableCell>
                          {payment.status === "COMPLETED" && (
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle>Preguntas Frecuentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-slate-900">
                  ¿Cómo puedo cancelar mi suscripción?
                </h4>
                <p className="text-sm text-slate-600 mt-1">
                  Puedes cancelar tu suscripción en cualquier momento. Tu plan seguirá activo hasta el final del período pagado.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-slate-900">
                  ¿Qué métodos de pago aceptan?
                </h4>
                <p className="text-sm text-slate-600 mt-1">
                  Aceptamos tarjetas de crédito (Visa, Mastercard, American Express), tarjetas de débito y transferencias bancarias a través de MercadoPago.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-slate-900">
                  ¿Puedo obtener un reembolso?
                </h4>
                <p className="text-sm text-slate-600 mt-1">
                  Ofrecemos reembolso completo dentro de los primeros 7 días si no estás satisfecho con el servicio.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-slate-900">
                  ¿Necesito boleta o factura?
                </h4>
                <p className="text-sm text-slate-600 mt-1">
                  Emitimos boletas electrónicas automáticamente. Si necesitas factura, contáctanos con tu RUT de empresa.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
