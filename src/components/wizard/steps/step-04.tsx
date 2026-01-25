"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useWizardStore } from "@/store/wizard-store";
import { step04Schema, type Step04FormData } from "@/lib/validations/wizard";
import { PURPOSES } from "@/lib/constants";

interface Step04FormProps {
  policyId: string;
}

export function Step04Form({ policyId }: Step04FormProps) {
  const router = useRouter();
  const { data, setStepData, markStepCompleted, setIsSaving, isSaving } = useWizardStore();

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<Step04FormData>({
    resolver: zodResolver(step04Schema),
    defaultValues: data.step04 || {
      purposes: {
        contractExecution: false,
        serviceProvision: false,
        billing: false,
        customerSupport: false,
        marketing: false,
        profiling: false,
        analytics: false,
        legalCompliance: false,
        taxObligations: false,
        employmentManagement: false,
        security: false,
        qualityControl: false,
        research: false,
        other: false,
      },
      customPurposes: [],
    },
  });

  const purposes = watch("purposes");

  const onSubmit = async (formData: Step04FormData) => {
    setIsSaving(true);

    try {
      const response = await fetch(`/api/policies/${policyId}/steps/4`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
      });

      if (!response.ok) {
        throw new Error("Error al guardar");
      }

      setStepData("step04", formData);
      markStepCompleted(4);
      toast.success("Paso 4 guardado correctamente");
      router.push(`/dashboard/wizard/${policyId}/5`);
    } catch (error) {
      toast.error("Error al guardar los datos");
    } finally {
      setIsSaving(false);
    }
  };

  const togglePurpose = (purposeId: keyof typeof purposes) => {
    setValue(`purposes.${purposeId}`, !purposes[purposeId]);
  };

  const groupedPurposes = {
    contractual: Object.entries(PURPOSES).filter(([_, p]) => p.category === "contractual"),
    operational: Object.entries(PURPOSES).filter(([_, p]) => p.category === "operational"),
    legal: Object.entries(PURPOSES).filter(([_, p]) => p.category === "legal"),
    commercial: Object.entries(PURPOSES).filter(([_, p]) => p.category === "commercial"),
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900">
              ¿Para qué finalidades utiliza tu empresa los datos personales?
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Selecciona todas las finalidades que apliquen. Cada finalidad debe
              tener una base legal válida (siguiente paso).
            </p>
          </div>
        </div>
      </div>

      {/* Contractual Purposes */}
      <div className="space-y-4">
        <h3 className="font-semibold text-slate-900">Finalidades Contractuales</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {groupedPurposes.contractual.map(([key, purpose]) => (
            <div
              key={key}
              className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                purposes[key as keyof typeof purposes]
                  ? "bg-indigo-50 border-indigo-300"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
              onClick={() => togglePurpose(key as keyof typeof purposes)}
            >
              <Checkbox
                checked={purposes[key as keyof typeof purposes]}
                onCheckedChange={() => togglePurpose(key as keyof typeof purposes)}
              />
              <Label className="font-medium cursor-pointer">{purpose.name}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Operational Purposes */}
      <div className="space-y-4">
        <h3 className="font-semibold text-slate-900">Finalidades Operacionales</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {groupedPurposes.operational.map(([key, purpose]) => (
            <div
              key={key}
              className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                purposes[key as keyof typeof purposes]
                  ? "bg-indigo-50 border-indigo-300"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
              onClick={() => togglePurpose(key as keyof typeof purposes)}
            >
              <Checkbox
                checked={purposes[key as keyof typeof purposes]}
                onCheckedChange={() => togglePurpose(key as keyof typeof purposes)}
              />
              <Label className="font-medium cursor-pointer">{purpose.name}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Legal Purposes */}
      <div className="space-y-4">
        <h3 className="font-semibold text-slate-900">Finalidades Legales</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {groupedPurposes.legal.map(([key, purpose]) => (
            <div
              key={key}
              className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                purposes[key as keyof typeof purposes]
                  ? "bg-indigo-50 border-indigo-300"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
              onClick={() => togglePurpose(key as keyof typeof purposes)}
            >
              <Checkbox
                checked={purposes[key as keyof typeof purposes]}
                onCheckedChange={() => togglePurpose(key as keyof typeof purposes)}
              />
              <Label className="font-medium cursor-pointer">{purpose.name}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Commercial Purposes */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold text-slate-900">
            Finalidades Comerciales (Requieren Consentimiento)
          </h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {groupedPurposes.commercial.map(([key, purpose]) => (
            <div
              key={key}
              className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                purposes[key as keyof typeof purposes]
                  ? "bg-amber-50 border-amber-300"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
              onClick={() => togglePurpose(key as keyof typeof purposes)}
            >
              <Checkbox
                checked={purposes[key as keyof typeof purposes]}
                onCheckedChange={() => togglePurpose(key as keyof typeof purposes)}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Label className="font-medium cursor-pointer">{purpose.name}</Label>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                    Consentimiento
                  </span>
                </div>
                {"warning" in purpose && (
                  <p className="text-xs text-amber-600 mt-1">{purpose.warning}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {errors.purposes && (
        <p className="text-sm text-red-500">{errors.purposes.message}</p>
      )}

      <div className="flex justify-end pt-6 border-t">
        <Button
          type="submit"
          disabled={isSaving}
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar y Continuar"
          )}
        </Button>
      </div>
    </form>
  );
}
