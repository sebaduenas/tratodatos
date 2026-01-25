import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  BarChart3,
  Download,
  FileText,
  TrendingUp,
  Calendar,
  Eye,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

async function getUserAnalytics(userId: string) {
  // Get user policies
  const policies = await prisma.policy.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      completionPct: true,
      createdAt: true,
      updatedAt: true,
      status: true,
    },
  });

  // Get download stats
  const downloads = await prisma.policyDownload.groupBy({
    by: ["format", "policyId"],
    where: {
      policy: { userId },
    },
    _count: { id: true },
  });

  // Get total downloads per policy
  const downloadsByPolicy = await prisma.policyDownload.groupBy({
    by: ["policyId"],
    where: {
      policy: { userId },
    },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  });

  // Get downloads over time (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentDownloads = await prisma.policyDownload.findMany({
    where: {
      policy: { userId },
      createdAt: { gte: thirtyDaysAgo },
    },
    select: {
      createdAt: true,
      format: true,
      policyId: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculate stats
  const totalPolicies = policies.length;
  const completedPolicies = policies.filter((p) => p.completionPct === 100).length;
  const totalDownloads = downloads.reduce((acc, d) => acc + d._count.id, 0);
  
  const downloadsByFormat = {
    pdf: downloads.filter((d) => d.format === "pdf").reduce((acc, d) => acc + d._count.id, 0),
    docx: downloads.filter((d) => d.format === "docx").reduce((acc, d) => acc + d._count.id, 0),
    html: downloads.filter((d) => d.format === "html").reduce((acc, d) => acc + d._count.id, 0),
  };

  // Get activity timeline
  const activityTimeline = recentDownloads.slice(0, 10);

  // Policy with most downloads
  const topPolicyId = downloadsByPolicy[0]?.policyId;
  const topPolicy = topPolicyId
    ? policies.find((p) => p.id === topPolicyId)
    : null;

  return {
    totalPolicies,
    completedPolicies,
    totalDownloads,
    downloadsByFormat,
    policies,
    activityTimeline,
    topPolicy: topPolicy
      ? {
          ...topPolicy,
          downloads: downloadsByPolicy[0]._count.id,
        }
      : null,
  };
}

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const analytics = await getUserAnalytics(session.user.id);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-CL", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Analytics
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Estadísticas de uso de tus políticas
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {analytics.totalPolicies}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Políticas totales
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {analytics.completedPolicies}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Completadas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {analytics.totalDownloads}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Descargas totales
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {analytics.totalPolicies > 0
                    ? Math.round(
                        (analytics.completedPolicies / analytics.totalPolicies) * 100
                      )
                    : 0}
                  %
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Tasa de completitud
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Downloads by Format */}
        <Card>
          <CardHeader>
            <CardTitle>Descargas por Formato</CardTitle>
            <CardDescription>
              Distribución de descargas de documentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    PDF
                  </span>
                  <span className="text-sm text-slate-500">
                    {analytics.downloadsByFormat.pdf}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{
                      width: `${
                        analytics.totalDownloads > 0
                          ? (analytics.downloadsByFormat.pdf /
                              analytics.totalDownloads) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Word
                  </span>
                  <span className="text-sm text-slate-500">
                    {analytics.downloadsByFormat.docx}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${
                        analytics.totalDownloads > 0
                          ? (analytics.downloadsByFormat.docx /
                              analytics.totalDownloads) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    HTML
                  </span>
                  <span className="text-sm text-slate-500">
                    {analytics.downloadsByFormat.html}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full"
                    style={{
                      width: `${
                        analytics.totalDownloads > 0
                          ? (analytics.downloadsByFormat.html /
                              analytics.totalDownloads) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Policy */}
        <Card>
          <CardHeader>
            <CardTitle>Política Más Descargada</CardTitle>
            <CardDescription>
              Tu política con más descargas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.topPolicy ? (
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900 dark:to-violet-900 flex items-center justify-center">
                  <FileText className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 dark:text-white">
                    {analytics.topPolicy.name}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {analytics.topPolicy.downloads} descargas
                  </p>
                </div>
                <Badge
                  className={
                    analytics.topPolicy.completionPct === 100
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }
                >
                  {analytics.topPolicy.completionPct}%
                </Badge>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <Download className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Aún no tienes descargas</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Últimas 10 descargas de tus políticas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.activityTimeline.length > 0 ? (
              <div className="space-y-3">
                {analytics.activityTimeline.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm">
                      {activity.format === "pdf" && (
                        <span className="text-red-500 font-medium text-xs">PDF</span>
                      )}
                      {activity.format === "docx" && (
                        <span className="text-blue-500 font-medium text-xs">DOC</span>
                      )}
                      {activity.format === "html" && (
                        <span className="text-orange-500 font-medium text-xs">HTML</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        Descarga de {activity.format.toUpperCase()}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formatDate(activity.createdAt)}
                      </p>
                    </div>
                    <Calendar className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                <Eye className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No hay actividad reciente</p>
                <p className="text-sm mt-1">
                  Las descargas de tus políticas aparecerán aquí
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
