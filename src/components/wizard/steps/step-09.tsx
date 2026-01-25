"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Download, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomCheckbox } from "@/components/ui/custom-checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useWizardStore } from "@/store/wizard-store";
import { step09Schema, type Step09FormData } from "@/lib/validations/wizard";

interface Step09FormProps {
  policyId: string;
}

type SourceKey = keyof Step09FormData["sources"];

const sourceOptions: { key: SourceKey; label: string; desc: string }[] = [
  { key: "directFromSubject", label: "Directamente del titular", desc: "Formularios, contratos, comunicaciones" },
  { key: "publicSources", label: "Fuentes públicas", desc: "Registros públicos, sitios web, redes sociales" },
  { key: "thirdParties", label: "Terceros", desc: "Socios comerciales, proveedores de datos" },
  { key: "automaticCollection", label: "Recolección automática", desc: "Cookies, logs, dispositivos" },
];

export function Step09Form({ policyId }: Step09FormProps) {
  const router = useRouter();
  const { data, setStepData, markStepCompleted, setIsSaving, isSaving } = useWizardStore();

  const defaultSources: Step09FormData["sources"] = {
    directFromSubject: false,
    publicSources: false,
    thirdParties: false,
    automaticCollection: false,
  };

  const { watch, setValue, handleSubmit, formState: { errors } } = useForm<Step09FormData>({
    resolver: zodResolver(step09Schema),
    defaultValues: data.step09 || {
      sources: defaultSources,
      thirdPartySources: [],
      publicSources: [],
      automaticCollectionMethods: [],
    },
  });

  const sources = watch("sources") || defaultSources;

  const onSubmit = async (formData: Step09FormData) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/policies/${policyId}/steps/9`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
      });
      if (!response.ok) throw new Error("Error al guardar");
      setStepData("step09", formData);
      markStepCompleted(9);
      toast.success("Paso 9 guardado correctamente");
      router.push(`/dashboard/wizard/${policyId}/10`);
    } catch (error) {
      toast.error("Error al guardar los datos");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSourceClick = (key: SourceKey) => {
    const currentValue = sources[key];
    setValue(`sources.${key}`, !currentValue, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <Download className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900">Fuentes de los Datos Personales</p>
            <p className="text-sm text-blue-700 mt-1">
              ¿De dónde obtiene tu empresa los datos personales que trata?
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sourceOptions.map(({ key, label, desc }) => {
          const isSelected = sources[key];
          return (
            <div
              key={key}
              className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                isSelected
                  ? "bg-indigo-50 border-indigo-300"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
              onClick={() => handleSourceClick(key)}
            >
              <CustomCheckbox checked={isSelected} />
              <div>
                <Label className="font-medium cursor-pointer">{label}</Label>
                <p className="text-sm text-slate-500">{desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {errors.sources && <p className="text-sm text-red-500">{errors.sources.message}</p>}

      {sources.automaticCollection && (
        <div className="bg-slate-50 rounded-lg p-4 border">
          <div className="flex gap-2 mb-2">
            <Info className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Métodos de recolección automática comunes</span>
          </div>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>• Cookies y tecnologías similares</li>
            <li>• Logs del servidor</li>
            <li>• Datos de dispositivos (IP, navegador)</li>
            <li>• Analytics y píxeles de seguimiento</li>
          </ul>
        </div>
      )}

      <div className="flex justify-end pt-6 border-t">
        <Button type="submit" disabled={isSaving} className="bg-gradient-to-r from-indigo-600 to-violet-600">
          {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Guardando...</> : "Guardar y Continuar"}
        </Button>
      </div>
    </form>
  );
}
