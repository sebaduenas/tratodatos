"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  History,
  RotateCcw,
  Eye,
  Clock,
  Loader2,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Version {
  id: string;
  version: number;
  changeNotes: string | null;
  createdAt: string;
}

interface VersionHistoryProps {
  policyId: string;
  currentVersion: number;
}

export function VersionHistory({
  policyId,
  currentVersion,
}: VersionHistoryProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [versions, setVersions] = useState<Version[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isRestoring, setIsRestoring] = useState<string | null>(null);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState<Version | null>(
    null
  );
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [changeNotes, setChangeNotes] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchVersions();
    }
  }, [isOpen]);

  const fetchVersions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/policies/${policyId}/versions`);
      if (response.ok) {
        const data = await response.json();
        setVersions(data.versions);
      }
    } catch (error) {
      console.error("Error fetching versions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateVersion = async () => {
    setIsCreating(true);
    try {
      const response = await fetch(`/api/policies/${policyId}/versions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ changeNotes }),
      });

      if (!response.ok) {
        throw new Error("Error al crear versión");
      }

      toast.success("Versión guardada correctamente");
      setShowCreateDialog(false);
      setChangeNotes("");
      fetchVersions();
      router.refresh();
    } catch (error) {
      toast.error("Error al guardar versión");
    } finally {
      setIsCreating(false);
    }
  };

  const handleRestore = async (version: Version) => {
    setIsRestoring(version.id);
    try {
      const response = await fetch(
        `/api/policies/${policyId}/versions/${version.id}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Error al restaurar");
      }

      toast.success(`Restaurado a versión ${version.version}`);
      setShowRestoreConfirm(null);
      fetchVersions();
      router.refresh();
    } catch (error) {
      toast.error("Error al restaurar versión");
    } finally {
      setIsRestoring(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <History className="w-4 h-4" />
            Historial
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Historial de Versiones</DialogTitle>
            <DialogDescription>
              Versión actual: {currentVersion}. Guarda puntos de restauración o
              vuelve a versiones anteriores.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="w-full gap-2 mb-4"
              variant="outline"
            >
              <Plus className="w-4 h-4" />
              Guardar versión actual
            </Button>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
              </div>
            ) : versions.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No hay versiones guardadas</p>
                <p className="text-sm mt-1">
                  Guarda versiones para poder restaurar más tarde
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {versions.map((version) => (
                    <div
                      key={version.id}
                      className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-900 dark:text-white">
                              Versión {version.version}
                            </span>
                            {version.version === currentVersion - 1 && (
                              <span className="text-xs text-slate-500">
                                (anterior)
                              </span>
                            )}
                          </div>
                          {version.changeNotes && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                              {version.changeNotes}
                            </p>
                          )}
                          <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                            <Clock className="w-3 h-3" />
                            {formatDate(version.createdAt)}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-indigo-600 hover:text-indigo-700"
                          onClick={() => setShowRestoreConfirm(version)}
                          disabled={isRestoring === version.id}
                        >
                          {isRestoring === version.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <RotateCcw className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Version Dialog */}
      <AlertDialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Guardar Versión</AlertDialogTitle>
            <AlertDialogDescription>
              Guarda el estado actual de tu política como una versión que podrás
              restaurar más tarde.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="change-notes">Notas de cambio (opcional)</Label>
            <Input
              id="change-notes"
              placeholder="Ej: Actualización de política de cookies"
              value={changeNotes}
              onChange={(e) => setChangeNotes(e.target.value)}
              className="mt-2"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCreating}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCreateVersion}
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Versión"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Restore Confirmation Dialog */}
      <AlertDialog
        open={!!showRestoreConfirm}
        onOpenChange={() => setShowRestoreConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Restaurar versión?</AlertDialogTitle>
            <AlertDialogDescription>
              Esto reemplazará el contenido actual de tu política con la versión{" "}
              {showRestoreConfirm?.version}. Se creará un backup automático de
              la versión actual.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                showRestoreConfirm && handleRestore(showRestoreConfirm)
              }
            >
              Restaurar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
