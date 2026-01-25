"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Info, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useWizardStore } from "@/store/wizard-store";
import { step03Schema, type Step03FormData } from "@/lib/validations/wizard";
import { DATA_SUBJECTS } from "@/lib/constants";

interface Step03FormProps {
  policyId: string;
}

type SubjectKey = keyof Step03FormData["subjects"];

export function Step03Form({ policyId }: Step03FormProps) {
  const router = useRouter();
  const { data, setStepData, markStepCompleted, setIsSaving, isSaving } = useWizardStore();

  const defaultSubjects: Step03FormData["subjects"] = {
    customers: false,
    employees: false,
    contractors: false,
    suppliers: false,
    websiteVisitors: false,
    appUsers: false,
    patients: false,
    students: false,
    minors: false,
    other: false,
  };

  const {
    watch,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step03FormData>({
    resolver: zodResolver(step03Schema),
    defaultValues: data.step03 || {
      subjects: defaultSubjects,
      customSubjects: [],
      processesMinorData: false,
      minorDataDetails: undefined,
    },
  });

  const subjects = watch("subjects") || defaultSubjects;
  const processesMinorData = watch("processesMinorData");

  const onSubmit = async (formData: Step03FormData) => {
    setIsSaving(true);

    try {
      const response = await fetch(`/api/policies/${policyId}/steps/3`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
      });

      if (!response.ok) {
        throw new Error("Error al guardar");
      }

      setStepData("step03", formData);
      markStepCompleted(3);
      toast.success("Paso 3 guardado correctamente");
      router.push(`/dashboard/wizard/${policyId}/4`);
    } catch (error) {
      toast.error("Error al guardar los datos");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubjectClick = (subjectId: SubjectKey) => {
    const currentValue = subjects[subjectId];
    setValue(`subjects.${subjectId}`, !currentValue, { shouldValidate: true });
    if (subjectId === "minors") {
      setValue("processesMinorData", !currentValue);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900">
              ¿De quiénes recopila datos personales tu empresa?
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Selecciona todos los tipos de personas cuyos datos personales trata tu
              empresa.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {Object.entries(DATA_SUBJECTS).map(([key, subject]) => {
          const subjectKey = key as SubjectKey;
          const isSelected = subjects[subjectKey];
          const isMinor = key === "minors";
          return (
            <div
              key={key}
              className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                isSelected
                  ? isMinor
                    ? "bg-purple-50 border-purple-300"
                    : "bg-indigo-50 border-indigo-300"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
              onClick={() => handleSubjectClick(subjectKey)}
            >
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                isSelected 
                  ? isMinor 
                    ? "bg-purple-600 border-purple-600" 
                    : "bg-indigo-600 border-indigo-600" 
                  : "border-slate-300"
              }`}>
                {isSelected && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Label className="font-medium cursor-pointer">{subject.name}</Label>
                  {isMinor && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                      Protección Especial
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {errors.subjects && (
        <p className="text-sm text-red-500">{errors.subjects.message}</p>
      )}

      {/* Minor Data Details */}
      {(subjects.minors || processesMinorData) && (
        <div className="space-y-4 p-6 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-purple-900">
              Información sobre Tratamiento de Datos de Menores
            </h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="minorDataDetails.ageRange">Rango de Edad</Label>
              <Input
                id="minorDataDetails.ageRange"
                placeholder="Ej: 6-17 años"
                {...register("minorDataDetails.ageRange")}
              />
              <p className="text-xs text-purple-600">
                Menores de 14 años requieren consentimiento de padres/tutores
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minorDataDetails.parentalConsentMechanism">
                Mecanismo de Consentimiento Parental
              </Label>
              <Textarea
                id="minorDataDetails.parentalConsentMechanism"
                placeholder="Describe cómo obtienes el consentimiento de los padres o tutores..."
                {...register("minorDataDetails.parentalConsentMechanism")}
              />
            </div>
          </div>
        </div>
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
