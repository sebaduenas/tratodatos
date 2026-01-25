"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Shield, Building, Server, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomCheckbox } from "@/components/ui/custom-checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useWizardStore } from "@/store/wizard-store";
import { step11Schema, type Step11FormData } from "@/lib/validations/wizard";
import { SECURITY_MEASURES } from "@/lib/constants";

interface Step11FormProps {
  policyId: string;
}

type OrgKey = keyof Step11FormData["organizational"];
type TechKey = keyof Step11FormData["technical"];
type PhysKey = keyof Step11FormData["physical"];

export function Step11Form({ policyId }: Step11FormProps) {
  const router = useRouter();
  const { data, setStepData, markStepCompleted, setIsSaving, isSaving } = useWizardStore();

  const defaultOrganizational: Step11FormData["organizational"] = {
    privacyPolicy: false,
    dataProtectionTraining: false,
    accessControl: false,
    confidentialityAgreements: false,
    incidentResponsePlan: false,
    vendorManagement: false,
  };

  const defaultTechnical: Step11FormData["technical"] = {
    encryption: false,
    pseudonymization: false,
    accessLogs: false,
    firewalls: false,
    antivirus: false,
    backups: false,
    secureDevelopment: false,
  };

  const defaultPhysical: Step11FormData["physical"] = {
    accessControl: false,
    surveillance: false,
    secureFacilities: false,
    deviceSecurity: false,
  };

  const { watch, setValue, handleSubmit } = useForm<Step11FormData>({
    resolver: zodResolver(step11Schema),
    defaultValues: data.step11 || {
      organizational: defaultOrganizational,
      technical: defaultTechnical,
      physical: defaultPhysical,
      customMeasures: [],
    },
  });

  const organizational = watch("organizational") || defaultOrganizational;
  const technical = watch("technical") || defaultTechnical;
  const physical = watch("physical") || defaultPhysical;

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

  const handleOrgClick = (key: OrgKey) => {
    setValue(`organizational.${key}`, !organizational[key], { shouldValidate: true });
  };

  const handleTechClick = (key: TechKey) => {
    setValue(`technical.${key}`, !technical[key], { shouldValidate: true });
  };

  const handlePhysClick = (key: PhysKey) => {
    setValue(`physical.${key}`, !physical[key], { shouldValidate: true });
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
          {Object.entries(SECURITY_MEASURES.organizational).map(([key, label]) => {
            const orgKey = key as OrgKey;
            const isSelected = organizational[orgKey];
            return (
              <div
                key={key}
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-indigo-50 border-indigo-300"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
                onClick={() => handleOrgClick(orgKey)}
              >
                <CustomCheckbox checked={isSelected} />
                <Label className="text-sm cursor-pointer">{label}</Label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technical */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-slate-600" />
          <h3 className="font-semibold text-slate-900">Medidas Técnicas</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {Object.entries(SECURITY_MEASURES.technical).map(([key, label]) => {
            const techKey = key as TechKey;
            const isSelected = technical[techKey];
            return (
              <div
                key={key}
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-indigo-50 border-indigo-300"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
                onClick={() => handleTechClick(techKey)}
              >
                <CustomCheckbox checked={isSelected} />
                <Label className="text-sm cursor-pointer">{label}</Label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Physical */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-slate-600" />
          <h3 className="font-semibold text-slate-900">Medidas Físicas</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {Object.entries(SECURITY_MEASURES.physical).map(([key, label]) => {
            const physKey = key as PhysKey;
            const isSelected = physical[physKey];
            return (
              <div
                key={key}
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-indigo-50 border-indigo-300"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
                onClick={() => handlePhysClick(physKey)}
              >
                <CustomCheckbox checked={isSelected} />
                <Label className="text-sm cursor-pointer">{label}</Label>
              </div>
            );
          })}
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
