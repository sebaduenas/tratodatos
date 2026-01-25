import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Shield, Download, FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PolicyPreview } from "@/components/wizard/policy-preview";
import { toPolicyType } from "@/types/policy";
import type { Metadata } from "next";

interface PublicPolicyPageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({
  params,
}: PublicPolicyPageProps): Promise<Metadata> {
  const { token } = await params;
  
  const policy = await prisma.policy.findFirst({
    where: { shareToken: token, isPublic: true },
    select: { name: true, step01Data: true },
  });

  if (!policy) {
    return {
      title: "Política no encontrada",
    };
  }

  const step01 = policy.step01Data as { companyName?: string } | null;
  const companyName = step01?.companyName || "Empresa";

  return {
    title: `Política de Datos - ${companyName}`,
    description: `Política de tratamiento de datos personales de ${companyName}, conforme a la Ley 21.719 de Chile.`,
  };
}

export default async function PublicPolicyPage({
  params,
}: PublicPolicyPageProps) {
  const { token } = await params;

  const policy = await prisma.policy.findFirst({
    where: {
      shareToken: token,
      isPublic: true,
    },
    include: {
      user: {
        select: { subscriptionTier: true },
      },
    },
  });

  if (!policy) {
    notFound();
  }

  // Increment view count (optional - could track in analytics)
  await prisma.auditLog.create({
    data: {
      userId: policy.userId,
      action: "POLICY_VIEWED_PUBLIC",
      resource: "policy",
      resourceId: policy.id,
      details: { shareToken: token },
    },
  });

  const step01 = policy.step01Data as { companyName?: string } | null;
  const companyName = step01?.companyName || "Empresa";
  const includeWatermark = policy.user.subscriptionTier === "FREE";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-900">
                TratoDatos
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Volver al inicio</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Política de Tratamiento de Datos Personales
          </h1>
          <p className="text-slate-600 mt-1">{companyName}</p>
        </div>

        <Card className="shadow-lg mb-6">
          <CardContent className="p-8">
            <PolicyPreview policy={toPolicyType(policy)} />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href={`/api/policies/${policy.id}/generate/pdf?token=${token}`}>
            <Button className="gap-2 bg-gradient-to-r from-indigo-600 to-violet-600">
              <Download className="w-4 h-4" />
              Descargar PDF
            </Button>
          </a>
          <a href={`/api/policies/${policy.id}/generate/html?token=${token}`}>
            <Button variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              Descargar HTML
            </Button>
          </a>
        </div>

        {/* Watermark notice */}
        {includeWatermark && (
          <p className="text-center text-xs text-slate-400 mt-8">
            Documento generado con{" "}
            <Link href="/" className="text-indigo-600 hover:underline">
              TratoDatos.cl
            </Link>
          </p>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-12 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-500">
            Política de datos conforme a la Ley 21.719 de Chile
          </p>
          <p className="text-xs text-slate-400 mt-2">
            ¿Necesitas crear tu propia política?{" "}
            <Link href="/" className="text-indigo-600 hover:underline">
              Crea la tuya gratis en TratoDatos.cl
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
