import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Download, FileText, Edit, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PolicyPreview } from "@/components/wizard/policy-preview";
import { toPolicyType } from "@/types/policy";

interface PreviewPageProps {
  params: Promise<{ policyId: string }>;
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const { policyId } = await params;

  const policy = await prisma.policy.findFirst({
    where: {
      id: policyId,
      userId: session.user.id,
    },
  });

  if (!policy) {
    notFound();
  }

  const isComplete = policy.completionPct === 100;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/dashboard/wizard/${policyId}/12`}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Volver al Wizard
                </Button>
              </Link>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <h1 className="font-semibold text-slate-900">{policy.name}</h1>
                <p className="text-sm text-slate-500">Vista Previa del Documento</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isComplete ? (
                <Badge className="bg-green-100 text-green-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Completa
                </Badge>
              ) : (
                <Badge variant="secondary">
                  {policy.completionPct}% completado
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          {/* Document Preview */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <PolicyPreview policy={toPolicyType(policy)} />
            </CardContent>
          </Card>

          {/* Actions Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Descargar Documento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isComplete ? (
                  <>
                    <a
                      href={`/api/policies/${policyId}/generate/pdf`}
                      download
                      className="block"
                    >
                      <Button className="w-full gap-2 bg-gradient-to-r from-indigo-600 to-violet-600">
                        <Download className="w-4 h-4" />
                        Descargar PDF
                      </Button>
                    </a>

                    <a
                      href={`/api/policies/${policyId}/generate/docx`}
                      download
                      className="block"
                    >
                      <Button variant="outline" className="w-full gap-2">
                        <FileText className="w-4 h-4" />
                        Descargar Word
                      </Button>
                    </a>

                    <Button variant="outline" className="w-full gap-2" disabled>
                      <FileText className="w-4 h-4" />
                      Ver HTML (próximamente)
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="w-full gap-2" disabled>
                      <Download className="w-4 h-4" />
                      Descargar PDF
                    </Button>
                    <Button variant="outline" className="w-full gap-2" disabled>
                      <FileText className="w-4 h-4" />
                      Descargar Word
                    </Button>
                    <Button variant="outline" className="w-full gap-2" disabled>
                      <FileText className="w-4 h-4" />
                      Ver HTML
                    </Button>
                    <p className="text-xs text-amber-600 text-center">
                      Completa todos los pasos para descargar
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/dashboard/wizard/${policyId}/1`} className="block">
                  <Button variant="outline" className="w-full gap-2">
                    <Edit className="w-4 h-4" />
                    Editar Política
                  </Button>
                </Link>

                <Link href="/dashboard" className="block">
                  <Button variant="ghost" className="w-full">
                    Volver al Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <div className="bg-slate-100 rounded-lg p-4 text-sm text-slate-600">
              <p className="font-medium text-slate-900 mb-2">💡 Tip</p>
              <p>
                Recuerda publicar esta política en tu sitio web y mantenerla
                actualizada ante cambios en tu tratamiento de datos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
