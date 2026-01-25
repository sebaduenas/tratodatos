"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Share2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useWizardStore } from "@/store/wizard-store";
import { step06Schema, type Step06FormData } from "@/lib/validations/wizard";

interface Step06FormProps {
  policyId: string;
}

export function Step06Form({ policyId }: Step06FormProps) {
  const router = useRouter();
  const { data, setStepData, markStepCompleted, setIsSaving, isSaving } = useWizardStore();

  const {
    watch,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step06FormData>({
    resolver: zodResolver(step06Schema),
    defaultValues: data.step06 || {
      sharesData: false,
      recipients: [],
      processorCategories: [],
      authorityDisclosures: [],
    },
  });

  const sharesData = watch("sharesData");
  const recipients = watch("recipients") || [];

  const onSubmit = async (formData: Step06FormData) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/policies/${policyId}/steps/6`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
      });
      if (!response.ok) throw new Error("Error al guardar");
      setStepData("step06", formData);
      markStepCompleted(6);
      toast.success("Paso 6 guardado correctamente");
      router.push(`/dashboard/wizard/${policyId}/7`);
    } catch (error) {
      toast.error("Error al guardar los datos");
    } finally {
      setIsSaving(false);
    }
  };

  const addRecipient = () => {
    setValue("recipients", [
      ...recipients,
      { id: crypto.randomUUID(), name: "", type: "processor", purpose: "", country: "Chile", hasContract: false },
    ]);
  };

  const removeRecipient = (id: string) => {
    setValue("recipients", recipients.filter((r) => r.id !== id));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <Share2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900">
              ¿Con quién comparte datos personales tu empresa?
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Identifica todos los terceros que reciben datos personales.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
        <div>
          <p className="font-medium text-slate-900">¿Comparte datos con terceros?</p>
          <p className="text-sm text-slate-500">Proveedores, socios, autoridades, etc.</p>
        </div>
        <Switch checked={sharesData} onCheckedChange={(v) => setValue("sharesData", v)} />
      </div>

      {sharesData && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Destinatarios de Datos</h4>
            <Button type="button" variant="outline" size="sm" onClick={addRecipient}>
              <Plus className="w-4 h-4 mr-1" /> Agregar
            </Button>
          </div>

          {recipients.map((recipient, index) => (
            <div key={recipient.id} className="p-4 border rounded-lg space-y-4 bg-white">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500">Destinatario {index + 1}</span>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeRecipient(recipient.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input
                    placeholder="Ej: Amazon Web Services"
                    value={recipient.name}
                    onChange={(e) => {
                      const updated = [...recipients];
                      updated[index].name = e.target.value;
                      setValue("recipients", updated);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select
                    value={recipient.type}
                    onValueChange={(v) => {
                      const updated = [...recipients];
                      updated[index].type = v as any;
                      setValue("recipients", updated);
                    }}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="processor">Encargado de tratamiento</SelectItem>
                      <SelectItem value="controller">Responsable conjunto</SelectItem>
                      <SelectItem value="authority">Autoridad pública</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Finalidad</Label>
                  <Input
                    placeholder="Ej: Almacenamiento en la nube"
                    value={recipient.purpose}
                    onChange={(e) => {
                      const updated = [...recipients];
                      updated[index].purpose = e.target.value;
                      setValue("recipients", updated);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>País</Label>
                  <Input
                    placeholder="Chile"
                    value={recipient.country}
                    onChange={(e) => {
                      const updated = [...recipients];
                      updated[index].country = e.target.value;
                      setValue("recipients", updated);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}

          {recipients.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <p className="text-slate-500">No hay destinatarios agregados</p>
              <Button type="button" variant="ghost" size="sm" onClick={addRecipient} className="mt-2">
                <Plus className="w-4 h-4 mr-1" /> Agregar Destinatario
              </Button>
            </div>
          )}
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
