"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Cpu, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useWizardStore } from "@/store/wizard-store";
import { step10Schema, type Step10FormData } from "@/lib/validations/wizard";

interface Step10FormProps {
  policyId: string;
}

export function Step10Form({ policyId }: Step10FormProps) {
  const router = useRouter();
  const { data, setStepData, markStepCompleted, setIsSaving, isSaving } = useWizardStore();

  const { watch, setValue, register, handleSubmit } = useForm<Step10FormData>({
    resolver: zodResolver(step10Schema),
    defaultValues: data.step10 || {
      hasAutomatedDecisions: false,
      decisions: [],
      profiling: { exists: false },
      humanReviewProcess: "",
      optOutMechanism: "",
    },
  });

  const hasAutomated = watch("hasAutomatedDecisions");
  const profiling = watch("profiling");

  const onSubmit = async (formData: Step10FormData) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/policies/${policyId}/steps/10`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
      });
      if (!response.ok) throw new Error("Error al guardar");
      setStepData("step10", formData);
      markStepCompleted(10);
      toast.success("Paso 10 guardado correctamente");
      router.push(`/dashboard/wizard/${policyId}/11`);
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
          <Cpu className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900">Decisiones Automatizadas y Perfilamiento</p>
            <p className="text-sm text-blue-700 mt-1">
              El Art. 15 bis garantiza el derecho a no ser objeto de decisiones basadas únicamente en tratamiento automatizado.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
        <div>
          <p className="font-medium text-slate-900">¿Toma decisiones automatizadas?</p>
          <p className="text-sm text-slate-500">Decisiones sin intervención humana que afectan a los titulares</p>
        </div>
        <Switch checked={hasAutomated} onCheckedChange={(v) => setValue("hasAutomatedDecisions", v)} />
      </div>

      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
        <div>
          <p className="font-medium text-slate-900">¿Realiza perfilamiento?</p>
          <p className="text-sm text-slate-500">Análisis automático para evaluar aspectos personales</p>
        </div>
        <Switch checked={profiling.exists} onCheckedChange={(v) => setValue("profiling.exists", v)} />
      </div>

      {(hasAutomated || profiling.exists) && (
        <>
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Las decisiones automatizadas con efectos jurídicos requieren garantías adicionales.
              El titular tiene derecho a obtener intervención humana.
            </AlertDescription>
          </Alert>

          {profiling.exists && (
            <div className="space-y-4 p-6 bg-slate-50 rounded-lg border">
              <h4 className="font-medium">Detalles del Perfilamiento</h4>
              <div className="space-y-2">
                <Label>Finalidad del perfilamiento</Label>
                <Textarea
                  placeholder="Ej: Personalización de ofertas comerciales..."
                  {...register("profiling.purpose")}
                />
              </div>
              <div className="space-y-2">
                <Label>Lógica involucrada</Label>
                <Textarea
                  placeholder="Describe la lógica del algoritmo de manera comprensible..."
                  {...register("profiling.logic")}
                />
              </div>
              <div className="space-y-2">
                <Label>Consecuencias para el titular</Label>
                <Textarea
                  placeholder="Ej: Determinación de ofertas, límites de crédito..."
                  {...register("profiling.consequences")}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Proceso de revisión humana</Label>
            <Textarea
              placeholder="Describe cómo puede el titular solicitar intervención humana..."
              {...register("humanReviewProcess")}
            />
          </div>

          <div className="space-y-2">
            <Label>Mecanismo de oposición (opt-out)</Label>
            <Textarea
              placeholder="Describe cómo puede el titular oponerse al tratamiento automatizado..."
              {...register("optOutMechanism")}
            />
          </div>
        </>
      )}

      <div className="flex justify-end pt-6 border-t">
        <Button type="submit" disabled={isSaving} className="bg-gradient-to-r from-indigo-600 to-violet-600">
          {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Guardando...</> : "Guardar y Continuar"}
        </Button>
      </div>
    </form>
  );
}
