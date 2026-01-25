"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Search, Filter, X, FileText, SortAsc, SortDesc } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
// PolicyActions needs to be passed as a render prop to avoid circular dependencies

interface Policy {
  id: string;
  name: string;
  status: string;
  currentStep: number;
  completionPct: number;
  createdAt: string;
  updatedAt: string;
  version: number;
}

interface PolicySearchProps {
  policies: Policy[];
  renderActions: (policy: Policy) => React.ReactNode;
}

type SortField = "name" | "updatedAt" | "completionPct" | "createdAt";
type SortOrder = "asc" | "desc";
type StatusFilter = "all" | "DRAFT" | "IN_PROGRESS" | "COMPLETED" | "PUBLISHED";

export function PolicySearch({ policies, renderActions }: PolicySearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortField, setSortField] = useState<SortField>("updatedAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const filteredAndSortedPolicies = useMemo(() => {
    let result = [...policies];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "updatedAt":
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case "createdAt":
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "completionPct":
          comparison = a.completionPct - b.completionPct;
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [policies, searchQuery, statusFilter, sortField, sortOrder]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge className="bg-green-100 text-green-700">Completada</Badge>;
      case "IN_PROGRESS":
        return <Badge className="bg-amber-100 text-amber-700">En progreso</Badge>;
      case "PUBLISHED":
        return <Badge className="bg-blue-100 text-blue-700">Publicada</Badge>;
      default:
        return <Badge variant="secondary">Borrador</Badge>;
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSortField("updatedAt");
    setSortOrder("desc");
  };

  const hasActiveFilters = searchQuery || statusFilter !== "all" || sortField !== "updatedAt" || sortOrder !== "desc";

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Estado
                {statusFilter !== "all" && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                    1
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filtrar por estado</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={statusFilter === "all"}
                onCheckedChange={() => setStatusFilter("all")}
              >
                Todos
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "DRAFT"}
                onCheckedChange={() => setStatusFilter("DRAFT")}
              >
                Borrador
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "IN_PROGRESS"}
                onCheckedChange={() => setStatusFilter("IN_PROGRESS")}
              >
                En progreso
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "COMPLETED"}
                onCheckedChange={() => setStatusFilter("COMPLETED")}
              >
                Completada
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "PUBLISHED"}
                onCheckedChange={() => setStatusFilter("PUBLISHED")}
              >
                Publicada
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                {sortOrder === "asc" ? (
                  <SortAsc className="w-4 h-4" />
                ) : (
                  <SortDesc className="w-4 h-4" />
                )}
                Ordenar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortField("updatedAt")}>
                Última actualización
                {sortField === "updatedAt" && " ✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortField("createdAt")}>
                Fecha de creación
                {sortField === "createdAt" && " ✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortField("name")}>
                Nombre
                {sortField === "name" && " ✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortField("completionPct")}>
                Progreso
                {sortField === "completionPct" && " ✓"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                {sortOrder === "asc" ? "Descendente" : "Ascendente"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} className="gap-2">
              <X className="w-4 h-4" />
              Limpiar
            </Button>
          )}
        </div>
      </div>

      {/* Results count */}
      {(searchQuery || statusFilter !== "all") && (
        <p className="text-sm text-slate-500">
          {filteredAndSortedPolicies.length} de {policies.length} políticas
        </p>
      )}

      {/* Policy List */}
      {filteredAndSortedPolicies.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">
            No se encontraron políticas
          </h3>
          <p className="text-slate-500 mt-1">
            {searchQuery
              ? `No hay políticas que coincidan con "${searchQuery}"`
              : "Intenta con otros filtros"}
          </p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Limpiar filtros
            </Button>
          )}
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {filteredAndSortedPolicies.map((policy) => (
            <div
              key={policy.id}
              className="flex flex-col md:flex-row items-start md:items-center justify-between py-4 rounded-lg hover:bg-slate-50 transition-colors px-2 -mx-2"
            >
              <Link
                href={`/dashboard/wizard/${policy.id}/${policy.currentStep}`}
                className="flex items-center gap-4 flex-grow mb-3 md:mb-0"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{policy.name}</p>
                  <p className="text-sm text-slate-500">
                    Actualizada{" "}
                    {new Date(policy.updatedAt).toLocaleDateString("es-CL")} |
                    Versión {policy.version}
                  </p>
                </div>
              </Link>
              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
                <div className="w-24">
                  <Progress value={policy.completionPct} className="h-2" />
                  <p className="text-xs text-slate-500 mt-1 text-right">
                    {policy.completionPct}%
                  </p>
                </div>
                {getStatusBadge(policy.status)}
                {renderActions(policy)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
