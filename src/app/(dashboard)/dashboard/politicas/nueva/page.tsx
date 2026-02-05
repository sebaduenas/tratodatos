"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Sparkles,
  Lock,
  ArrowRight,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { POLICY_TEMPLATES, PolicyTemplate } from "@/lib/constants/templates";
import { useSession } from "next-auth/react";

export default function NewPolicyPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [policyName, setPolicyName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const userTier = (session?.user?.subscriptionTier || "FREE") as
    | "FREE"
    | "PROFESSIONAL"
    | "ENTERPRISE";

  const tierOrder = ["FREE", "PROFESSIONAL", "ENTERPRISE"];
  const userTierIndex = tierOrder.indexOf(userTier);

  const canUseTemplate = (template: PolicyTemplate) => {
    const templateTierIndex = tierOrder.indexOf(template.tier);
    return templateTierIndex <= userTierIndex;
  };

  const handleCreate = async () => {
    if (!policyName.trim()) {
      toast.error("Ingresa un nombre para la política");
      return;
    }

    setIsCreating(true);
    try {
      const template = selectedTemplate
        ? POLICY_TEMPLATES.find((t) => t.id === selectedTemplate)
        : null;

      const response = await fetch("/api/policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: policyName,
          templateId: selectedTemplate,
          templateData: template?.data,
        }),
      });

      if (!response.ok) {
        let errorMessage = "Error al crear política";
        try {
          const data = await response.json();
          errorMessage = data.error || errorMessage;
        } catch {
          errorMessage = `Error del servidor (${response.status})`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      router.push(`/dashboard/wizard/${data.id}/1`);
    } catch (error) {
      console.error("Error creating policy:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al crear política"
      );
    } finally {
      setIsCreating(false);
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "PROFESSIONAL":
        return (
          <Badge className="bg-indigo-100 text-indigo-700 text-xs">Pro</Badge>
        );
      case "ENTERPRISE":
        return (
          <Badge className="bg-violet-100 text-violet-700 text-xs">
            Empresa
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/politicas">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Nueva Política
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Crea una nueva política de tratamiento de datos
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Policy Name */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Nombre de la Política
            </CardTitle>
            <CardDescription>
              Elige un nombre descriptivo para identificar esta política
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="policy-name">Nombre</Label>
              <Input
                id="policy-name"
                placeholder="Ej: Política de Privacidad - Sitio Web"
                value={policyName}
                onChange={(e) => setPolicyName(e.target.value)}
                className="max-w-md"
              />
            </div>
          </CardContent>
        </Card>

        {/* Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Usar Plantilla (Opcional)
            </CardTitle>
            <CardDescription>
              Comienza con una plantilla predefinida para tu industria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Blank Template */}
              <button
                onClick={() => setSelectedTemplate(null)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedTemplate === null
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl">
                    📄
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      Comenzar en Blanco
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Crea tu política desde cero
                    </p>
                  </div>
                </div>
              </button>

              {/* Industry Templates */}
              {POLICY_TEMPLATES.map((template) => {
                const canUse = canUseTemplate(template);
                const isSelected = selectedTemplate === template.id;

                return (
                  <button
                    key={template.id}
                    onClick={() => canUse && setSelectedTemplate(template.id)}
                    disabled={!canUse}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950"
                        : canUse
                        ? "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                        : "border-slate-200 dark:border-slate-700 opacity-60 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl">
                        {template.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-slate-900 dark:text-white">
                            {template.name}
                          </h4>
                          {getTierBadge(template.tier)}
                          {!canUse && (
                            <Lock className="w-3 h-3 text-slate-400" />
                          )}
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {template.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {userTier === "FREE" && (
              <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-950 rounded-lg">
                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                  💡{" "}
                  <Link
                    href="/dashboard/facturacion"
                    className="underline font-medium"
                  >
                    Actualiza tu plan
                  </Link>{" "}
                  para acceder a todas las plantillas de industria.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Button */}
        <div className="flex justify-end gap-4">
          <Link href="/dashboard/politicas">
            <Button variant="outline">Cancelar</Button>
          </Link>
          <Button
            onClick={handleCreate}
            disabled={!policyName.trim() || isCreating}
            className="gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creando...
              </>
            ) : (
              <>
                Crear Política
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
