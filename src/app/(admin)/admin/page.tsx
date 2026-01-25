import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Users, FileText, Download, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

async function getAdminStats() {
  const now = new Date();
  const startOfToday = new Date(now.setHours(0, 0, 0, 0));
  const startOfWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalUsers,
    usersToday,
    usersThisWeek,
    totalPolicies,
    completedPolicies,
    downloadsToday,
    usersByTier,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.user.count({ where: { createdAt: { gte: startOfWeek } } }),
    prisma.policy.count(),
    prisma.policy.count({ where: { status: "COMPLETED" } }),
    prisma.policyDownload.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.user.groupBy({ by: ["subscriptionTier"], _count: { id: true } }),
    prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        companyName: true,
        subscriptionTier: true,
        createdAt: true,
        _count: { select: { policies: true } },
      },
    }),
  ]);

  const tierCounts: Record<string, number> = { FREE: 0, PROFESSIONAL: 0, ENTERPRISE: 0 };
  usersByTier.forEach((t: { subscriptionTier: string; _count: { id: number } }) => {
    tierCounts[t.subscriptionTier] = t._count.id;
  });

  return {
    totalUsers,
    usersToday,
    usersThisWeek,
    totalPolicies,
    completedPolicies,
    downloadsToday,
    tierCounts,
    recentUsers,
    completionRate: totalPolicies > 0 ? Math.round((completedPolicies / totalPolicies) * 100) : 0,
  };
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const stats = await getAdminStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Panel de Administración</h1>
        <p className="text-slate-600 mt-1">Bienvenido, {session?.user?.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Usuarios</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalUsers}</p>
                <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3 h-3" />
                  +{stats.usersToday} hoy
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Políticas</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalPolicies}</p>
                <p className="text-sm text-slate-500 mt-1">
                  {stats.completedPolicies} completadas
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Descargas Hoy</p>
                <p className="text-3xl font-bold text-slate-900">{stats.downloadsToday}</p>
                <p className="text-sm text-slate-500 mt-1">PDFs generados</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Download className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Tasa Completitud</p>
                <p className="text-3xl font-bold text-slate-900">{stats.completionRate}%</p>
                <p className="text-sm text-slate-500 mt-1">Políticas finalizadas</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tier Distribution & Recent Users */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Plan</CardTitle>
            <CardDescription>Usuarios según su suscripción</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Gratuito</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-400"
                      style={{ width: `${(stats.tierCounts.FREE / stats.totalUsers) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-12 text-right">{stats.tierCounts.FREE}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Profesional</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500"
                      style={{ width: `${(stats.tierCounts.PROFESSIONAL / stats.totalUsers) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-12 text-right">{stats.tierCounts.PROFESSIONAL}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Empresa</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-500"
                      style={{ width: `${(stats.tierCounts.ENTERPRISE / stats.totalUsers) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-12 text-right">{stats.tierCounts.ENTERPRISE}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usuarios Recientes</CardTitle>
            <CardDescription>Últimos 10 registros</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentUsers.map((user: { id: string; email: string; name: string | null; companyName: string | null; subscriptionTier: string; _count: { policies: number } }) => (
                <div key={user.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="font-medium text-slate-900">{user.name || user.email}</p>
                    <p className="text-sm text-slate-500">{user.companyName || "Sin empresa"}</p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={user.subscriptionTier === "FREE" ? "secondary" : "default"}
                      className={
                        user.subscriptionTier === "PROFESSIONAL"
                          ? "bg-indigo-100 text-indigo-700"
                          : user.subscriptionTier === "ENTERPRISE"
                          ? "bg-violet-100 text-violet-700"
                          : ""
                      }
                    >
                      {user.subscriptionTier}
                    </Badge>
                    <p className="text-xs text-slate-500 mt-1">
                      {user._count.policies} política(s)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
