import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Plus,
  FileText,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Trash2,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
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
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PLAN_LIMITS } from "@/lib/constants";
import { PolicyActions } from "./policy-actions";

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge className="bg-green-100 text-green-700 gap-1">
            <CheckCircle className="w-3 h-3" />
            Completada
          </Badge>
        );
      case "IN_PROGRESS":
        return (
          <Badge className="bg-amber-100 text-amber-700 gap-1">
            <Clock className="w-3 h-3" />
            En progreso
          </Badge>
        );
      case "PUBLISHED":
        return (
          <Badge className="bg-blue-100 text-blue-700 gap-1">
            <CheckCircle className="w-3 h-3" />
            Publicada
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="gap-1">
            <AlertCircle className="w-3 h-3" />
            Borrador
          </Badge>
        );
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-CL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

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
          <Link href="/dashboard/politicas/nueva">
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
        <div className="space-y-4">
          {policies.map((policy) => (
            <Card key={policy.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 md:p-6">
                  {/* Icon and Info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-slate-900 truncate">
                          {policy.name}
                        </h3>
                        {getStatusBadge(policy.status)}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                        <span>Creada: {formatDate(policy.createdAt)}</span>
                        <span className="hidden md:inline">•</span>
                        <span className="hidden md:inline">
                          Actualizada: {formatDate(policy.updatedAt)}
                        </span>
                        {policy.version > 1 && (
                          <>
                            <span className="hidden md:inline">•</span>
                            <span className="hidden md:inline">
                              Versión {policy.version}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="w-32">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-500">Progreso</span>
                        <span className="font-medium text-slate-900">
                          {policy.completionPct}%
                        </span>
                      </div>
                      <Progress value={policy.completionPct} className="h-2" />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {policy.completionPct === 100 ? (
                        <Link href={`/dashboard/wizard/${policy.id}/preview`}>
                          <Button variant="outline" size="sm" className="gap-1.5">
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">Ver</span>
                          </Button>
                        </Link>
                      ) : (
                        <Link href={`/dashboard/wizard/${policy.id}/${policy.currentStep}`}>
                          <Button size="sm" className="gap-1.5 bg-indigo-600 hover:bg-indigo-700">
                            <Edit className="w-4 h-4" />
                            <span className="hidden sm:inline">Continuar</span>
                          </Button>
                        </Link>
                      )}

                      <PolicyActions
                        policyId={policy.id}
                        policyName={policy.name}
                        isComplete={policy.completionPct === 100}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
