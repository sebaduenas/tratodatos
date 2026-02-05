"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Shield,
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  User,
  CreditCard,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { NotificationBell } from "@/components/notifications/notification-bell";

interface DashboardNavProps {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
    subscriptionTier: string;
  };
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/politicas", label: "Mis Políticas", icon: FileText },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
];

export function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname();

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  const getPlanBadge = (tier: string) => {
    switch (tier) {
      case "PROFESSIONAL":
        return (
          <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
            Pro
          </Badge>
        );
      case "ENTERPRISE":
        return (
          <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100">
            Empresa
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-slate-600">
            Gratis
          </Badge>
        );
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b border-slate-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900">TratoDatos</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "gap-2",
                    pathname === item.href
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
            {(user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
              <Link href="/admin">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "gap-2",
                    pathname.startsWith("/admin")
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600"
                  )}
                >
                  <Settings className="w-4 h-4" />
                  Admin
                </Button>
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4" data-onboarding="user-menu">
          <NotificationBell />
          {getPlanBadge(user.subscriptionTier)}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 h-10">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-indigo-100 text-indigo-700 text-sm">
                    {getInitials(user.name, user.email)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline text-sm font-medium text-slate-700">
                  {user.name || user.email}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium text-slate-900">
                  {user.name || "Usuario"}
                </p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/perfil" className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  Mi Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/facturacion" className="cursor-pointer">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Facturación
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-red-600 cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
