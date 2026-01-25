"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle, Calendar, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useWizardStore } from "@/store/wizard-store";
import { step12Schema, type Step12FormData } from "@/lib/validations/wizard";

interface Step12FormProps {
  policyId: string;
}

export function Step12Form({ policyId }: Step12FormProps) {
  const router = useRouter();
  const { data, setStepData, markStepCompleted, setIsSaving, isSaving, getCompletionPercentage } = useWizardStore();

  const { watch, setValue, register, handleSubmit, formState: { errors } } = useForm<Step12FormData>({
    resolver: zodResolver(step12Schema),
    defaultValues: data.step12 || {
      effectiveDate: new Date().toISOString().split("T")[0],
      reviewFrequency: "annual",
      responsiblePerson: "",
      contactChannel: "",
      responseTime: "15",
      rightsExerciseProcess: "",
      complaintProcess: "",
    },
  });

  const onSubmit = async (formData: Step12FormData) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/policies/${policyId}/steps/12`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
      });
      if (!response.ok) throw new Error("Error al guardar");
      setStepData("step12", formData);
      markStepCompleted(12);
      toast.success("¡Política completada! 🎉");
      router.push(`/dashboard/wizard/${policyId}/preview`);
    } catch (error) {
      toast.error("Error al guardar los datos");
    } finally {
      setIsSaving(false);
    }
  };

  const completionPct = getCompletionPercentage();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-green-900">¡Último paso!</p>
            <p className="text-sm text-green-700 mt-1">
              Configura los detalles finales de tu política y cómo los titulares pueden ejercer sus derechos.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <Label>Fecha de entrada en vigencia *</Label>
          </div>
          <Input
            type="date"
            {...register("effectiveDate")}
            className={errors.effectiveDate ? "border-red-500" : ""}
          />
          {errors.effectiveDate && <p className="text-sm text-red-500">{errors.effectiveDate.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Frecuencia de revisión</Label>
          <Select value={watch("reviewFrequency")} onValueChange={(v: any) => setValue("reviewFrequency", v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="annual">Anual</SelectItem>
              <SelectItem value="biannual">Semestral</SelectItem>
              <SelectItem value="asNeeded">Según necesidad</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Responsable de la Política *</Label>
        <Input
          placeholder="Nombre del responsable o área"
          {...register("responsiblePerson")}
          className={errors.responsiblePerson ? "border-red-500" : ""}
        />
        {errors.responsiblePerson && <p className="text-sm text-red-500">{errors.responsiblePerson.message}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-500" />
            <Label>Canal de contacto *</Label>
          </div>
          <Input
            placeholder="datospersonales@miempresa.cl"
            {...register("contactChannel")}
            className={errors.contactChannel ? "border-red-500" : ""}
          />
          {errors.contactChannel && <p className="text-sm text-red-500">{errors.contactChannel.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <Label>Plazo de respuesta (días hábiles)</Label>
          </div>
          <Select value={watch("responseTime")} onValueChange={(v) => setValue("responseTime", v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 días</SelectItem>
              <SelectItem value="15">15 días (recomendado)</SelectItem>
              <SelectItem value="20">20 días</SelectItem>
              <SelectItem value="30">30 días</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Proceso de ejercicio de derechos ARCO *</Label>
        <Textarea
          placeholder="Describe cómo los titulares pueden ejercer sus derechos de acceso, rectificación, cancelación y oposición..."
          {...register("rightsExerciseProcess")}
          className={errors.rightsExerciseProcess ? "border-red-500" : ""}
          rows={4}
        />
        {errors.rightsExerciseProcess && <p className="text-sm text-red-500">{errors.rightsExerciseProcess.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Proceso de reclamos *</Label>
        <Textarea
          placeholder="Describe cómo los titulares pueden presentar reclamos y cómo se procesan..."
          {...register("complaintProcess")}
          className={errors.complaintProcess ? "border-red-500" : ""}
          rows={4}
        />
        {errors.complaintProcess && <p className="text-sm text-red-500">{errors.complaintProcess.message}</p>}
      </div>

      <div className="flex justify-end pt-6 border-t">
        <Button type="submit" disabled={isSaving} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
          {isSaving ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Finalizando...</>
          ) : (
            <><CheckCircle className="w-4 h-4 mr-2" />Finalizar y Ver Vista Previa</>
          )}
        </Button>
      </div>
    </form>
  );
}
