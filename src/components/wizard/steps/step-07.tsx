"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Globe, Plus, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useWizardStore } from "@/store/wizard-store";
import { step07Schema, type Step07FormData } from "@/lib/validations/wizard";

interface Step07FormProps {
  policyId: string;
}

export function Step07Form({ policyId }: Step07FormProps) {
  const router = useRouter();
  const { data, setStepData, markStepCompleted, setIsSaving, isSaving } = useWizardStore();

  const { watch, setValue, handleSubmit } = useForm<Step07FormData>({
    resolver: zodResolver(step07Schema),
    defaultValues: data.step07 || {
      hasInternationalTransfers: false,
      transfers: [],
      mechanisms: {
        adequacyDecision: false,
        standardClauses: false,
        bindingCorporateRules: false,
        explicitConsent: false,
        contractNecessity: false,
      },
    },
  });

  const hasTransfers = watch("hasInternationalTransfers");
  const transfers = watch("transfers") || [];
  const mechanisms = watch("mechanisms");

  const onSubmit = async (formData: Step07FormData) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/policies/${policyId}/steps/7`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
      });
      if (!response.ok) throw new Error("Error al guardar");
      setStepData("step07", formData);
      markStepCompleted(7);
      toast.success("Paso 7 guardado correctamente");
      router.push(`/dashboard/wizard/${policyId}/8`);
    } catch (error) {
      toast.error("Error al guardar los datos");
    } finally {
      setIsSaving(false);
    }
  };

  const addTransfer = () => {
    setValue("transfers", [
      ...transfers,
      { id: crypto.randomUUID(), country: "", recipient: "", purpose: "", mechanism: "", hasAdequacy: false },
    ]);
  };

  const removeTransfer = (id: string) => {
    setValue("transfers", transfers.filter((t) => t.id !== id));
  };

  const mechanismOptions = [
    { key: "adequacyDecision", label: "Decisión de adecuación" },
    { key: "standardClauses", label: "Cláusulas contractuales tipo" },
    { key: "bindingCorporateRules", label: "Normas corporativas vinculantes" },
    { key: "explicitConsent", label: "Consentimiento explícito" },
    { key: "contractNecessity", label: "Necesidad contractual" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <Globe className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900">Transferencias Internacionales de Datos</p>
            <p className="text-sm text-blue-700 mt-1">
              Indica si transfiere datos personales fuera de Chile.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
        <div>
          <p className="font-medium text-slate-900">¿Realiza transferencias internacionales?</p>
          <p className="text-sm text-slate-500">Envío de datos a países fuera de Chile</p>
        </div>
        <Switch checked={hasTransfers} onCheckedChange={(v) => setValue("hasInternationalTransfers", v)} />
      </div>

      {hasTransfers && (
        <>
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Las transferencias internacionales requieren garantías adecuadas según el Art. 16 de la Ley 21.719.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Transferencias</h4>
              <Button type="button" variant="outline" size="sm" onClick={addTransfer}>
                <Plus className="w-4 h-4 mr-1" /> Agregar
              </Button>
            </div>

            {transfers.map((transfer, index) => (
              <div key={transfer.id} className="p-4 border rounded-lg space-y-4 bg-white">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-500">Transferencia {index + 1}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeTransfer(transfer.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>País de destino</Label>
                    <Input
                      placeholder="Ej: Estados Unidos"
                      value={transfer.country}
                      onChange={(e) => {
                        const updated = [...transfers];
                        updated[index].country = e.target.value;
                        setValue("transfers", updated);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Destinatario</Label>
                    <Input
                      placeholder="Ej: Amazon Web Services"
                      value={transfer.recipient}
                      onChange={(e) => {
                        const updated = [...transfers];
                        updated[index].recipient = e.target.value;
                        setValue("transfers", updated);
                      }}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label>Finalidad</Label>
                    <Input
                      placeholder="Ej: Almacenamiento en la nube"
                      value={transfer.purpose}
                      onChange={(e) => {
                        const updated = [...transfers];
                        updated[index].purpose = e.target.value;
                        setValue("transfers", updated);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Mecanismos de Transferencia</h4>
            <div className="grid md:grid-cols-2 gap-4">
              {mechanismOptions.map(({ key, label }) => (
                <div
                  key={key}
                  className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer ${
                    mechanisms[key as keyof typeof mechanisms]
                      ? "bg-indigo-50 border-indigo-300"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                  onClick={() =>
                    setValue(`mechanisms.${key as keyof typeof mechanisms}`, !mechanisms[key as keyof typeof mechanisms])
                  }
                >
                  <Checkbox checked={mechanisms[key as keyof typeof mechanisms]} />
                  <Label className="cursor-pointer">{label}</Label>
                </div>
              ))}
            </div>
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
