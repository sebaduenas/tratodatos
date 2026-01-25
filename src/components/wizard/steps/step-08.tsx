"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useWizardStore } from "@/store/wizard-store";
import { step08Schema, type Step08FormData } from "@/lib/validations/wizard";

interface Step08FormProps {
  policyId: string;
}

const retentionPeriods = [
  { value: "1y", label: "1 año" },
  { value: "2y", label: "2 años" },
  { value: "3y", label: "3 años" },
  { value: "5y", label: "5 años" },
  { value: "6y", label: "6 años (tributario)" },
  { value: "10y", label: "10 años" },
  { value: "indefinite", label: "Mientras dure la relación" },
];

export function Step08Form({ policyId }: Step08FormProps) {
  const router = useRouter();
  const { data, setStepData, markStepCompleted, setIsSaving, isSaving } = useWizardStore();

  const { watch, setValue, register, handleSubmit, formState: { errors } } = useForm<Step08FormData>({
    resolver: zodResolver(step08Schema),
    defaultValues: data.step08 || {
      defaultPeriod: "",
      periods: [],
      deletionProcess: "",
      archivingPolicy: "",
    },
  });

  const onSubmit = async (formData: Step08FormData) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/policies/${policyId}/steps/8`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
      });
      if (!response.ok) throw new Error("Error al guardar");
      setStepData("step08", formData);
      markStepCompleted(8);
      toast.success("Paso 8 guardado correctamente");
      router.push(`/dashboard/wizard/${policyId}/9`);
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
          <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900">Plazos de Conservación de Datos</p>
            <p className="text-sm text-blue-700 mt-1">
              Los datos no deben conservarse más tiempo del necesario para la finalidad.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Período de conservación general</Label>
        <Select value={watch("defaultPeriod")} onValueChange={(v) => setValue("defaultPeriod", v)}>
          <SelectTrigger className={errors.defaultPeriod ? "border-red-500" : ""}>
            <SelectValue placeholder="Selecciona un período" />
          </SelectTrigger>
          <SelectContent>
            {retentionPeriods.map((period) => (
              <SelectItem key={period.value} value={period.value}>{period.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.defaultPeriod && <p className="text-sm text-red-500">{errors.defaultPeriod.message}</p>}
        <p className="text-sm text-slate-500">
          Este es el período por defecto. Algunas categorías pueden requerir períodos distintos.
        </p>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 border">
        <div className="flex gap-2 mb-3">
          <Info className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700">Períodos comunes según ley chilena</span>
        </div>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• <strong>6 años:</strong> Documentos tributarios y contables</li>
          <li>• <strong>5 años:</strong> Documentación laboral</li>
          <li>• <strong>3 años:</strong> Datos de marketing (desde último contacto)</li>
          <li>• <strong>Indefinido:</strong> Mientras dure la relación contractual</li>
        </ul>
      </div>

      <div className="space-y-2">
        <Label htmlFor="deletionProcess">Proceso de Eliminación *</Label>
        <Textarea
          id="deletionProcess"
          placeholder="Describe cómo se eliminan los datos cuando ya no son necesarios..."
          {...register("deletionProcess")}
          className={errors.deletionProcess ? "border-red-500" : ""}
        />
        {errors.deletionProcess && <p className="text-sm text-red-500">{errors.deletionProcess.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="archivingPolicy">Política de Archivo (opcional)</Label>
        <Textarea
          id="archivingPolicy"
          placeholder="Describe cómo se archivan los datos que deben conservarse por obligación legal..."
          {...register("archivingPolicy")}
        />
      </div>

      <div className="flex justify-end pt-6 border-t">
        <Button type="submit" disabled={isSaving} className="bg-gradient-to-r from-indigo-600 to-violet-600">
          {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Guardando...</> : "Guardar y Continuar"}
        </Button>
      </div>
    </form>
  );
}
