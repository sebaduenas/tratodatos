"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Building2, User, MapPin, Phone, Mail, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useWizardStore } from "@/store/wizard-store";
import { step01Schema, type Step01FormData } from "@/lib/validations/wizard";
import { CHILEAN_REGIONS } from "@/lib/constants";

interface Step01FormProps {
  policyId: string;
}

export function Step01Form({ policyId }: Step01FormProps) {
  const router = useRouter();
  const { data, setStepData, markStepCompleted, setIsSaving, isSaving } = useWizardStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Step01FormData>({
    resolver: zodResolver(step01Schema),
    defaultValues: data.step01 || {
      companyName: "",
      rut: "",
      legalRepName: "",
      legalRepRut: "",
      address: "",
      city: "",
      region: "",
      phone: "",
      email: "",
      website: "",
      hasDPO: false,
      dpoName: "",
      dpoEmail: "",
      dpoPhone: "",
    },
  });

  const hasDPO = watch("hasDPO");

  const onSubmit = async (formData: Step01FormData) => {
    setIsSaving(true);

    // Agregar https:// al website si no tiene protocolo
    if (formData.website && formData.website.trim() !== '') {
      if (!formData.website.startsWith('http://') && !formData.website.startsWith('https://')) {
        formData.website = `https://${formData.website}`;
      }
    }

    try {
      const response = await fetch(`/api/policies/${policyId}/steps/1`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
      });

      if (!response.ok) {
        throw new Error("Error al guardar");
      }

      setStepData("step01", formData);
      markStepCompleted(1);
      toast.success("Paso 1 guardado correctamente");
      router.push(`/dashboard/wizard/${policyId}/2`);
    } catch (error) {
      toast.error("Error al guardar los datos");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Company Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-700">
          <Building2 className="w-5 h-5" />
          <h3 className="font-semibold">Datos de la Empresa</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Razón Social *</Label>
            <Input
              id="companyName"
              placeholder="Mi Empresa SpA"
              {...register("companyName")}
              className={errors.companyName ? "border-red-500" : ""}
            />
            {errors.companyName && (
              <p className="text-sm text-red-500">{errors.companyName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rut">RUT Empresa *</Label>
            <Input
              id="rut"
              placeholder="12.345.678-9"
              {...register("rut")}
              className={errors.rut ? "border-red-500" : ""}
            />
            {errors.rut && (
              <p className="text-sm text-red-500">{errors.rut.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Legal Rep */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-700">
          <User className="w-5 h-5" />
          <h3 className="font-semibold">Representante Legal</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="legalRepName">Nombre Completo *</Label>
            <Input
              id="legalRepName"
              placeholder="Juan Pérez González"
              {...register("legalRepName")}
              className={errors.legalRepName ? "border-red-500" : ""}
            />
            {errors.legalRepName && (
              <p className="text-sm text-red-500">{errors.legalRepName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="legalRepRut">RUT Representante *</Label>
            <Input
              id="legalRepRut"
              placeholder="12.345.678-9"
              {...register("legalRepRut")}
              className={errors.legalRepRut ? "border-red-500" : ""}
            />
            {errors.legalRepRut && (
              <p className="text-sm text-red-500">{errors.legalRepRut.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-700">
          <MapPin className="w-5 h-5" />
          <h3 className="font-semibold">Dirección</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Dirección *</Label>
            <Input
              id="address"
              placeholder="Av. Providencia 1234, Of. 567"
              {...register("address")}
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad *</Label>
              <Input
                id="city"
                placeholder="Santiago"
                {...register("city")}
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Región *</Label>
              <Select
                value={watch("region")}
                onValueChange={(value) => setValue("region", value)}
              >
                <SelectTrigger className={errors.region ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecciona una región" />
                </SelectTrigger>
                <SelectContent>
                  {CHILEAN_REGIONS.map((region) => (
                    <SelectItem key={region.code} value={region.code}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.region && (
                <p className="text-sm text-red-500">{errors.region.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-700">
          <Phone className="w-5 h-5" />
          <h3 className="font-semibold">Contacto</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono *</Label>
            <Input
              id="phone"
              placeholder="+56 912345678"
              {...register("phone")}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="contacto@miempresa.cl"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Sitio Web</Label>
            <Input
              id="website"
              placeholder="https://miempresa.cl"
              {...register("website")}
              className={errors.website ? "border-red-500" : ""}
            />
            {errors.website && (
              <p className="text-sm text-red-500">{errors.website.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* DPO */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-700">
          <Shield className="w-5 h-5" />
          <h3 className="font-semibold">Delegado de Protección de Datos (DPO)</h3>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
          <div>
            <p className="font-medium text-slate-900">
              ¿Tiene designado un DPO?
            </p>
            <p className="text-sm text-slate-500">
              Opcional pero recomendado para empresas grandes
            </p>
          </div>
          <Switch
            checked={hasDPO}
            onCheckedChange={(checked) => setValue("hasDPO", checked)}
          />
        </div>

        {hasDPO && (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dpoName">Nombre del DPO</Label>
              <Input
                id="dpoName"
                placeholder="María García"
                {...register("dpoName")}
                className={errors.dpoName ? "border-red-500" : ""}
              />
              {errors.dpoName && (
                <p className="text-sm text-red-500">{errors.dpoName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dpoEmail">Email del DPO</Label>
              <Input
                id="dpoEmail"
                type="email"
                placeholder="dpo@miempresa.cl"
                {...register("dpoEmail")}
                className={errors.dpoEmail ? "border-red-500" : ""}
              />
              {errors.dpoEmail && (
                <p className="text-sm text-red-500">{errors.dpoEmail.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dpoPhone">Teléfono del DPO</Label>
              <Input
                id="dpoPhone"
                placeholder="+56 912345678"
                {...register("dpoPhone")}
              />
            </div>
          </div>
        )}
      </div>

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
