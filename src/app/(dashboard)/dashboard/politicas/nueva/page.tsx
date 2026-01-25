"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useWizardStore } from "@/store/wizard-store";

const newPolicySchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede tener más de 100 caracteres"),
});

type NewPolicyFormData = z.infer<typeof newPolicySchema>;

export default function NewPolicyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const resetWizard = useWizardStore((state) => state.resetWizard);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPolicyFormData>({
    resolver: zodResolver(newPolicySchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: NewPolicyFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.upgrade) {
          toast.error(result.error, {
            action: {
              label: "Ver planes",
              onClick: () => router.push("/dashboard/facturacion"),
            },
          });
        } else {
          toast.error(result.error || "Error al crear la política");
        }
        return;
      }

      // Reset wizard state and redirect
      resetWizard();
      toast.success("Política creada exitosamente");
      router.push(`/dashboard/wizard/${result.policy.id}/1`);
    } catch (error) {
      toast.error("Error al crear la política");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link
        href="/dashboard"
        className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Volver al Dashboard
      </Link>

      <Card className="border-slate-200/50 shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-indigo-600" />
          </div>
          <CardTitle className="text-2xl">Nueva Política de Datos</CardTitle>
          <CardDescription className="text-base">
            Crea una nueva política de tratamiento de datos personales conforme
            a la Ley 21.719
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Política</Label>
              <Input
                id="name"
                placeholder="Ej: Política de Privacidad Mi Empresa 2026"
                {...register("name")}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
              <p className="text-sm text-slate-500">
                Este nombre es solo para tu referencia interna
              </p>
            </div>

            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
              <div className="flex gap-3">
                <Sparkles className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-indigo-900">
                    ¿Qué incluye el wizard?
                  </p>
                  <ul className="text-sm text-indigo-700 mt-2 space-y-1">
                    <li>• 12 pasos guiados con lenguaje simple</li>
                    <li>• Textos legales pre-redactados</li>
                    <li>• Guardado automático del progreso</li>
                    <li>• Generación de PDF profesional</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Link href="/dashboard" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancelar
                </Button>
              </Link>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Comenzar Wizard"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
