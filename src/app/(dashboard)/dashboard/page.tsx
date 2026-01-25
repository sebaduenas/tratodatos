import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Plus,
  FileText,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PLAN_LIMITS } from "@/lib/constants";

async function getUserPolicies(userId: string) {
  return prisma.policy.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      status: true,
      currentStep: true,
      completionPct: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

async function getUserStats(userId: string) {
  const [totalPolicies, completedPolicies] = await Promise.all([
    prisma.policy.count({ where: { userId } }),
    prisma.policy.count({ where: { userId, status: "COMPLETED" } }),
  ]);

  return { totalPolicies, completedPolicies };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const [policies, stats] = await Promise.all([
    getUserPolicies(session.user.id),
    getUserStats(session.user.id),
  ]);

  const planLimit =
    PLAN_LIMITS[session.user.subscriptionTier as keyof typeof PLAN_LIMITS];
  const canCreatePolicy = stats.totalPolicies < planLimit.maxPolicies;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge className="bg-green-100 text-green-700">Completada</Badge>
        );
      case "IN_PROGRESS":
        return (
          <Badge className="bg-amber-100 text-amber-700">En progreso</Badge>
        );
      case "PUBLISHED":
        return <Badge className="bg-blue-100 text-blue-700">Publicada</Badge>;
      default:
        return <Badge variant="secondary">Borrador</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            ¡Hola, {session.user.name?.split(" ")[0] || "Usuario"}!
          </h1>
          <p className="text-slate-600 mt-1">
            Gestiona tus políticas de tratamiento de datos
          </p>
        </div>
        {canCreatePolicy ? (
          <Link href="/dashboard/politicas/nueva">
            <Button className="gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700">
              <Plus className="w-4 h-4" />
              Nueva Política
            </Button>
          </Link>
        ) : (
          <Link href="/dashboard/facturacion">
            <Button variant="outline" className="gap-2">
              <Sparkles className="w-4 h-4" />
              Actualizar Plan
            </Button>
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Políticas Creadas</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.totalPolicies}{" "}
                  <span className="text-sm font-normal text-slate-400">
                    / {planLimit.maxPolicies}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Completadas</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.completedPolicies}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Plan Actual</p>
                <p className="text-2xl font-bold text-slate-900">
                  {planLimit.name}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Policies */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Políticas Recientes</CardTitle>
              <CardDescription>
                Tus últimas políticas de tratamiento de datos
              </CardDescription>
            </div>
            <Link href="/dashboard/politicas">
              <Button variant="ghost" size="sm" className="gap-1">
                Ver todas
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {policies.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">
                Sin políticas aún
              </h3>
              <p className="text-slate-500 mt-1 mb-6">
                Crea tu primera política de tratamiento de datos
              </p>
              <Link href="/dashboard/politicas/nueva">
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Crear Primera Política
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {policies.map((policy: { id: string; name: string; status: string; currentStep: number; completionPct: number; updatedAt: Date }) => (
                <Link
                  key={policy.id}
                  href={`/dashboard/wizard/${policy.id}/${policy.currentStep}`}
                  className="flex items-center justify-between py-4 hover:bg-slate-50 -mx-4 px-4 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{policy.name}</p>
                      <p className="text-sm text-slate-500">
                        Actualizada{" "}
                        {new Date(policy.updatedAt).toLocaleDateString("es-CL")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden md:block w-32">
                      <Progress value={policy.completionPct} className="h-2" />
                      <p className="text-xs text-slate-500 mt-1 text-right">
                        {policy.completionPct}%
                      </p>
                    </div>
                    {getStatusBadge(policy.status)}
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upgrade CTA for free users */}
      {session.user.subscriptionTier === "FREE" && (
        <Card className="mt-8 bg-gradient-to-r from-indigo-50 to-violet-50 border-indigo-200">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">
                  ¿Necesitas más políticas?
                </h3>
                <p className="text-sm text-slate-600">
                  Actualiza a Pro para crear hasta 5 políticas sin marca de agua
                </p>
              </div>
            </div>
            <Link href="/dashboard/facturacion">
              <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700">
                Ver Planes
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
