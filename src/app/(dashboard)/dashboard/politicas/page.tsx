import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PLAN_LIMITS } from "@/lib/constants";
import { PolicySearchClient } from "./policy-search-client";

async function getAllUserPolicies(userId: string) {
  return prisma.policy.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      status: true,
      currentStep: true,
      completionPct: true,
      createdAt: true,
      updatedAt: true,
      version: true,
    },
  });
}

export default async function PoliciesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/login");
  }

  const policies = await getAllUserPolicies(session.user.id);
  
  const planLimit =
    PLAN_LIMITS[session.user.subscriptionTier as keyof typeof PLAN_LIMITS];
  const canCreatePolicy = policies.length < planLimit.maxPolicies;

  // Convert dates to strings for client component
  const policiesForClient = policies.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mis Políticas</h1>
          <p className="text-slate-600 mt-1">
            {policies.length} de {planLimit.maxPolicies} políticas utilizadas
          </p>
        </div>
        {canCreatePolicy ? (
          <Link href="/dashboard/politicas/nueva" data-onboarding="new-policy">
            <Button className="gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700">
              <Plus className="w-4 h-4" />
              Nueva Política
            </Button>
          </Link>
        ) : (
          <Link href="/dashboard/facturacion">
            <Button variant="outline" className="gap-2">
              Actualizar Plan para crear más
            </Button>
          </Link>
        )}
      </div>

      {/* Policies List */}
      {policies.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">
                No tienes políticas aún
              </h3>
              <p className="text-slate-500 mt-1 mb-6 max-w-md mx-auto">
                Crea tu primera política de tratamiento de datos personales y
                cumple con la Ley 21.719.
              </p>
              <Link href="/dashboard/politicas/nueva">
                <Button className="gap-2 bg-gradient-to-r from-indigo-600 to-violet-600">
                  <Plus className="w-4 h-4" />
                  Crear Primera Política
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <PolicySearchClient policies={policiesForClient} />
          </CardContent>
        </Card>
      )}

      {/* Usage Info */}
      {policies.length > 0 && (
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-slate-900">
                  Uso de tu plan {planLimit.name}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Has utilizado {policies.length} de {planLimit.maxPolicies}{" "}
                  políticas disponibles
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-48">
                  <Progress
                    value={(policies.length / planLimit.maxPolicies) * 100}
                    className="h-3"
                  />
                </div>
                {!canCreatePolicy && (
                  <Link href="/dashboard/facturacion">
                    <Button size="sm">Actualizar Plan</Button>
                  </Link>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
