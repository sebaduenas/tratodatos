"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Trash2,
  Download,
  FileText,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { toast } from "sonner";

interface PolicyActionsProps {
  policyId: string;
  policyName: string;
  isComplete: boolean;
}

export function PolicyActions({
  policyId,
  policyName,
  isComplete,
}: PolicyActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDuplicate = async () => {
    setIsDuplicating(true);
    try {
      const response = await fetch(`/api/policies/${policyId}/duplicate`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Error al duplicar");
      }

      const data = await response.json();
      toast.success("Política duplicada correctamente");
      router.push(`/dashboard/wizard/${data.id}/1`);
      router.refresh();
    } catch (error) {
      toast.error("Error al duplicar la política");
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/policies/${policyId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar");
      }

      toast.success("Política eliminada correctamente");
      setShowDeleteDialog(false);
      router.refresh();
    } catch (error) {
      toast.error("Error al eliminar la política");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="w-4 h-4" />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() =>
              router.push(
                isComplete
                  ? `/dashboard/wizard/${policyId}/preview`
                  : `/dashboard/wizard/${policyId}/1`
              )
            }
          >
            {isComplete ? (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Ver política
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Editar política
              </>
            )}
          </DropdownMenuItem>

          {isComplete && (
            <>
              <DropdownMenuItem asChild>
                <a href={`/api/policies/${policyId}/generate/pdf`} download>
                  <Download className="w-4 h-4 mr-2" />
                  Descargar PDF
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={`/api/policies/${policyId}/generate/docx`} download>
                  <FileText className="w-4 h-4 mr-2" />
                  Descargar Word
                </a>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleDuplicate} disabled={isDuplicating}>
            {isDuplicating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Duplicando...
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Duplicar
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar política?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de eliminar <strong>{policyName}</strong>. Esta
              acción no se puede deshacer y perderás todo el contenido de la
              política.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
