"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Shield, Building, Server, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useWizardStore } from "@/store/wizard-store";
import { step11Schema, type Step11FormData } from "@/lib/validations/wizard";
import { SECURITY_MEASURES } from "@/lib/constants";

interface Step11FormProps {
  policyId: string;
}

export function Step11Form({ policyId }: Step11FormProps) {
  const router = useRouter();
  const { data, setStepData, markStepCompleted, setIsSaving, isSaving } = useWizardStore();

  const { watch, setValue, handleSubmit } = useForm<Step11FormData>({
    resolver: zodResolver(step11Schema),
    defaultValues: data.step11 || {
      organizational: {
        privacyPolicy: false,
        dataProtectionTraining: false,
        accessControl: false,
        confidentialityAgreements: false,
        incidentResponsePlan: false,
        vendorManagement: false,
      },
      technical: {
        encryption: false,
        pseudonymization: false,
        accessLogs: false,
        firewalls: false,
        antivirus: false,
        backups: false,
        secureDevelopment: false,
      },
      physical: {
        accessControl: false,
        surveillance: false,
        secureFacilities: false,
        deviceSecurity: false,
      },
      customMeasures: [],
    },
  });

  const organizational = watch("organizational");
  const technical = watch("technical");
  const physical = watch("physical");

  const onSubmit = async (formData: Step11FormData) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/policies/${policyId}/steps/11`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
      });
      if (!response.ok) throw new Error("Error al guardar");
      setStepData("step11", formData);
      markStepCompleted(11);
      toast.success("Paso 11 guardado correctamente");
      router.push(`/dashboard/wizard/${policyId}/12`);
    } catch (error) {
      toast.error("Error al guardar los datos");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900">Medidas de Seguridad</p>
            <p className="text-sm text-blue-700 mt-1">
              Selecciona las medidas de seguridad implementadas para proteger los datos personales.
            </p>
          </div>
        </div>
      </div>

      {/* Organizational */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Building className="w-5 h-5 text-slate-600" />
          <h3 className="font-semibold text-slate-900">Medidas Organizacionales</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {Object.entries(SECURITY_MEASURES.organizational).map(([key, label]) => (
            <div
              key={key}
              className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer ${
                organizational[key as keyof typeof organizational]
                  ? "bg-indigo-50 border-indigo-300"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
              onClick={() =>
                setValue(
                  `organizational.${key as keyof typeof organizational}`,
                  !organizational[key as keyof typeof organizational]
                )
              }
            >
              <Checkbox checked={organizational[key as keyof typeof organizational]} />
              <Label className="text-sm cursor-pointer">{label}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Technical */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-slate-600" />
          <h3 className="font-semibold text-slate-900">Medidas Técnicas</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {Object.entries(SECURITY_MEASURES.technical).map(([key, label]) => (
            <div
              key={key}
              className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer ${
                technical[key as keyof typeof technical]
                  ? "bg-indigo-50 border-indigo-300"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
              onClick={() =>
                setValue(`technical.${key as keyof typeof technical}`, !technical[key as keyof typeof technical])
              }
            >
              <Checkbox checked={technical[key as keyof typeof technical]} />
              <Label className="text-sm cursor-pointer">{label}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Physical */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-slate-600" />
          <h3 className="font-semibold text-slate-900">Medidas Físicas</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {Object.entries(SECURITY_MEASURES.physical).map(([key, label]) => (
            <div
              key={key}
              className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer ${
                physical[key as keyof typeof physical]
                  ? "bg-indigo-50 border-indigo-300"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
              onClick={() =>
                setValue(`physical.${key as keyof typeof physical}`, !physical[key as keyof typeof physical])
              }
            >
              <Checkbox checked={physical[key as keyof typeof physical]} />
              <Label className="text-sm cursor-pointer">{label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t">
        <Button type="submit" disabled={isSaving} className="bg-gradient-to-r from-indigo-600 to-violet-600">
          {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Guardando...</> : "Guardar y Continuar"}
        </Button>
      </div>
    </form>
  );
}
