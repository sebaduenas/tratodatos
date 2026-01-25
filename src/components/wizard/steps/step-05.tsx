"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomCheckbox } from "@/components/ui/custom-checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useWizardStore } from "@/store/wizard-store";
import { step05Schema, type Step05FormData } from "@/lib/validations/wizard";
import { LEGAL_BASES } from "@/lib/constants";

interface Step05FormProps {
  policyId: string;
}

type BaseKey = keyof Step05FormData["bases"];

export function Step05Form({ policyId }: Step05FormProps) {
  const router = useRouter();
  const { data, setStepData, markStepCompleted, setIsSaving, isSaving } = useWizardStore();

  const defaultBases: Step05FormData["bases"] = {
    consent: false,
    contract: false,
    legalObligation: false,
    vitalInterest: false,
    publicInterest: false,
    legitimateInterest: false,
  };

  const {
    watch,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step05FormData>({
    resolver: zodResolver(step05Schema),
    defaultValues: data.step05 || {
      bases: defaultBases,
      consentDetails: undefined,
      legitimateInterestAssessment: undefined,
    },
  });

  const bases = watch("bases") || defaultBases;

  const onSubmit = async (formData: Step05FormData) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/policies/${policyId}/steps/5`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
      });
      if (!response.ok) throw new Error("Error al guardar");
      setStepData("step05", formData);
      markStepCompleted(5);
      toast.success("Paso 5 guardado correctamente");
      router.push(`/dashboard/wizard/${policyId}/6`);
    } catch (error) {
      toast.error("Error al guardar los datos");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBaseClick = (baseId: BaseKey) => {
    const currentValue = bases[baseId];
    setValue(`bases.${baseId}`, !currentValue, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <Scale className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900">
              ¿Cuál es la base legal para el tratamiento de datos?
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Todo tratamiento de datos debe tener al menos una base legal válida
              según la Ley 21.719.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(LEGAL_BASES).map(([key, base]) => {
          const baseKey = key as BaseKey;
          const isSelected = bases[baseKey];
          return (
            <div
              key={key}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                isSelected
                  ? "bg-indigo-50 border-indigo-300"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
              onClick={() => handleBaseClick(baseKey)}
            >
              <div className="flex items-start space-x-3">
                <CustomCheckbox checked={isSelected} className="mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Label className="font-medium cursor-pointer">{base.name}</Label>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {base.article}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{base.description}</p>
                  {"warning" in base && (
                    <p className="text-xs text-amber-600 mt-2">⚠️ {base.warning}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {bases.consent && (
        <div className="space-y-4 p-6 bg-slate-50 rounded-lg border">
          <h4 className="font-medium">Detalles del Consentimiento</h4>
          <div className="space-y-2">
            <Label>Mecanismo de obtención</Label>
            <Textarea
              placeholder="Ej: Checkbox en formulario de registro, firma de documento..."
              {...register("consentDetails.mechanism")}
            />
          </div>
          <div className="space-y-2">
            <Label>Proceso de revocación</Label>
            <Textarea
              placeholder="Ej: Solicitud por email, opción en perfil de usuario..."
              {...register("consentDetails.withdrawalProcess")}
            />
          </div>
        </div>
      )}

      {bases.legitimateInterest && (
        <div className="space-y-4 p-6 bg-amber-50 rounded-lg border border-amber-200">
          <h4 className="font-medium text-amber-900">
            Evaluación de Interés Legítimo (LIA)
          </h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>¿Cuál es el interés legítimo?</Label>
              <Textarea
                placeholder="Describe el interés legítimo que persigue tu empresa..."
                {...register("legitimateInterestAssessment.interest")}
              />
            </div>
            <div className="space-y-2">
              <Label>¿Por qué es necesario el tratamiento?</Label>
              <Textarea
                placeholder="Explica por qué no hay alternativas menos intrusivas..."
                {...register("legitimateInterestAssessment.necessity")}
              />
            </div>
            <div className="space-y-2">
              <Label>Test de ponderación</Label>
              <Textarea
                placeholder="Explica cómo los derechos del titular no prevalecen sobre el interés..."
                {...register("legitimateInterestAssessment.balancingTest")}
              />
            </div>
          </div>
        </div>
      )}

      {errors.bases && (
        <p className="text-sm text-red-500">{errors.bases.message}</p>
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
