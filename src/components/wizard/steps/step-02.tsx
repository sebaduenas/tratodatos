"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useWizardStore } from "@/store/wizard-store";
import { step02Schema, type Step02FormData } from "@/lib/validations/wizard";
import { DATA_CATEGORIES, SENSITIVE_CATEGORIES } from "@/lib/constants";

interface Step02FormProps {
  policyId: string;
}

export function Step02Form({ policyId }: Step02FormProps) {
  const router = useRouter();
  const { data, setStepData, markStepCompleted, setIsSaving, isSaving } = useWizardStore();

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<Step02FormData>({
    resolver: zodResolver(step02Schema),
    defaultValues: data.step02 || {
      categories: {
        identification: false,
        contact: false,
        financial: false,
        employment: false,
        health: false,
        biometric: false,
        genetic: false,
        ethnic: false,
        political: false,
        religious: false,
        sexualOrientation: false,
        criminal: false,
        minors: false,
        geolocation: false,
        behavioral: false,
        other: false,
      },
      customCategories: [],
      hasSensitiveData: false,
      hasMinorData: false,
    },
  });

  const categories = watch("categories");

  // Check if any sensitive data is selected
  const hasSensitive = SENSITIVE_CATEGORIES.some(
    (cat) => categories[cat as keyof typeof categories]
  );
  const hasMinors = categories.minors;

  const onSubmit = async (formData: Step02FormData) => {
    // Auto-set sensitive and minor flags
    formData.hasSensitiveData = hasSensitive;
    formData.hasMinorData = hasMinors;

    setIsSaving(true);

    try {
      const response = await fetch(`/api/policies/${policyId}/steps/2`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
      });

      if (!response.ok) {
        throw new Error("Error al guardar");
      }

      setStepData("step02", formData);
      markStepCompleted(2);
      toast.success("Paso 2 guardado correctamente");
      router.push(`/dashboard/wizard/${policyId}/3`);
    } catch (error) {
      toast.error("Error al guardar los datos");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleCategory = (categoryId: keyof typeof categories) => {
    setValue(`categories.${categoryId}`, !categories[categoryId]);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900">
              ¿Qué tipos de datos personales recopila tu empresa?
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Selecciona todas las categorías de datos que tu empresa trata. Los
              datos sensibles requieren protección especial.
            </p>
          </div>
        </div>
      </div>

      {/* Regular Data Categories */}
      <div className="space-y-4">
        <h3 className="font-semibold text-slate-900">Datos Personales Comunes</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(DATA_CATEGORIES)
            .filter(([key]) => !SENSITIVE_CATEGORIES.includes(key as any) && key !== "minors")
            .map(([key, category]) => (
              <div
                key={key}
                className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  categories[key as keyof typeof categories]
                    ? "bg-indigo-50 border-indigo-300"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
                onClick={() => toggleCategory(key as keyof typeof categories)}
              >
                <Checkbox
                  checked={categories[key as keyof typeof categories]}
                  onCheckedChange={() =>
                    toggleCategory(key as keyof typeof categories)
                  }
                />
                <div className="flex-1">
                  <Label className="font-medium cursor-pointer">
                    {category.name}
                  </Label>
                  <p className="text-sm text-slate-500 mt-1">
                    {category.description}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Ej: {category.examples.slice(0, 3).join(", ")}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Sensitive Data Categories */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold text-slate-900">
            Datos Sensibles (Protección Especial)
          </h3>
        </div>

        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            Los datos sensibles requieren <strong>consentimiento explícito</strong> del
            titular y medidas de seguridad reforzadas según el Art. 16 ter de la Ley
            21.719.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(DATA_CATEGORIES)
            .filter(([key]) => SENSITIVE_CATEGORIES.includes(key as any))
            .map(([key, category]) => (
              <div
                key={key}
                className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  categories[key as keyof typeof categories]
                    ? "bg-amber-50 border-amber-300"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
                onClick={() => toggleCategory(key as keyof typeof categories)}
              >
                <Checkbox
                  checked={categories[key as keyof typeof categories]}
                  onCheckedChange={() =>
                    toggleCategory(key as keyof typeof categories)
                  }
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Label className="font-medium cursor-pointer">
                      {category.name}
                    </Label>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                      Sensible
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    {category.description}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Minors Data */}
      <div className="space-y-4">
        <h3 className="font-semibold text-slate-900">Datos de Menores</h3>

        <div
          className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
            categories.minors
              ? "bg-purple-50 border-purple-300"
              : "bg-white border-slate-200 hover:bg-slate-50"
          }`}
          onClick={() => toggleCategory("minors")}
        >
          <Checkbox
            checked={categories.minors}
            onCheckedChange={() => toggleCategory("minors")}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Label className="font-medium cursor-pointer">
                {DATA_CATEGORIES.minors.name}
              </Label>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                Protección Especial
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {DATA_CATEGORIES.minors.description}
            </p>
            <p className="text-xs text-purple-600 mt-2">
              ⚠️ Menores de 14 años requieren consentimiento de padres/tutores
            </p>
          </div>
        </div>
      </div>

      {errors.categories && (
        <p className="text-sm text-red-500">{errors.categories.message}</p>
      )}

      {hasSensitive && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            Has seleccionado datos sensibles. En los siguientes pasos deberás
            especificar las bases legales y medidas de seguridad adicionales
            requeridas.
          </AlertDescription>
        </Alert>
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
