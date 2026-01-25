"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Share2,
  Copy,
  Check,
  QrCode,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface ShareDialogProps {
  policyId: string;
  policyName: string;
  isComplete: boolean;
  initialShareToken?: string | null;
}

export function ShareDialog({
  policyId,
  policyName,
  isComplete,
  initialShareToken,
}: ShareDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(!!initialShareToken);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (initialShareToken) {
      setShareUrl(`${window.location.origin}/politica/${initialShareToken}`);
      setIsPublic(true);
    }
  }, [initialShareToken]);

  const handleToggleShare = async (enabled: boolean) => {
    setIsLoading(true);
    try {
      if (enabled) {
        const response = await fetch(`/api/policies/${policyId}/share`, {
          method: "POST",
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Error al compartir");
        }

        const data = await response.json();
        setShareUrl(data.shareUrl);
        setIsPublic(true);
        toast.success("Link de compartir generado");
      } else {
        await fetch(`/api/policies/${policyId}/share`, {
          method: "DELETE",
        });
        setShareUrl(null);
        setIsPublic(false);
        toast.success("Link de compartir revocado");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al actualizar"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copiado al portapapeles");
    setTimeout(() => setCopied(false), 2000);
  };

  const qrCodeUrl = shareUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={!isComplete}
        >
          <Share2 className="w-4 h-4" />
          Compartir
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartir Política</DialogTitle>
          <DialogDescription>
            Comparte tu política de datos con un link público
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Toggle Share */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="public-share">Compartir públicamente</Label>
              <p className="text-xs text-slate-500">
                Cualquiera con el link podrá ver tu política
              </p>
            </div>
            <Switch
              id="public-share"
              checked={isPublic}
              onCheckedChange={handleToggleShare}
              disabled={isLoading}
            />
          </div>

          {/* Share URL */}
          {isPublic && shareUrl && (
            <>
              <div className="space-y-2">
                <Label>Link para compartir</Label>
                <div className="flex gap-2">
                  <Input
                    value={shareUrl}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* QR Code */}
              <div className="space-y-2">
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700"
                >
                  <QrCode className="w-4 h-4" />
                  {showQR ? "Ocultar" : "Mostrar"} código QR
                </button>

                {showQR && qrCodeUrl && (
                  <div className="flex justify-center p-4 bg-white rounded-lg border">
                    <img
                      src={qrCodeUrl}
                      alt="QR Code"
                      className="w-48 h-48"
                    />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-800">
                  <strong>Nota:</strong> Puedes revocar el acceso en cualquier
                  momento desactivando el switch.
                </p>
              </div>
            </>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
