// Hook for auto-saving form data in the wizard
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface UseAutoSaveOptions {
  policyId: string;
  step: number;
  data: any;
  onSave?: (data: any) => void;
  debounceMs?: number;
  enabled?: boolean;
}

interface AutoSaveState {
  status: "idle" | "saving" | "saved" | "error";
  lastSaved: Date | null;
  error: string | null;
}

export function useAutoSave({
  policyId,
  step,
  data,
  onSave,
  debounceMs = 3000, // 3 seconds default
  enabled = true,
}: UseAutoSaveOptions) {
  const [state, setState] = useState<AutoSaveState>({
    status: "idle",
    lastSaved: null,
    error: null,
  });

  const previousDataRef = useRef<string>("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Save function
  const save = useCallback(
    async (dataToSave: any) => {
      if (!enabled || !policyId) return;

      // Check if data actually changed
      const dataString = JSON.stringify(dataToSave);
      if (dataString === previousDataRef.current) return;

      setState((prev) => ({ ...prev, status: "saving", error: null }));

      try {
        const response = await fetch(`/api/policies/${policyId}/steps/${step}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: dataToSave, autoSave: true }),
        });

        if (!response.ok) {
          throw new Error("Error al guardar");
        }

        previousDataRef.current = dataString;

        if (isMountedRef.current) {
          setState({
            status: "saved",
            lastSaved: new Date(),
            error: null,
          });

          onSave?.(dataToSave);
        }
      } catch (error) {
        if (isMountedRef.current) {
          setState((prev) => ({
            ...prev,
            status: "error",
            error: "Error al guardar automáticamente",
          }));
        }
      }
    },
    [enabled, policyId, step, onSave]
  );

  // Manual save trigger
  const saveNow = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    save(data);
  }, [save, data]);

  // Auto-save on data change with debounce
  useEffect(() => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      save(data);
    }, debounceMs);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, debounceMs, enabled, save]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Save on window/tab close
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const dataString = JSON.stringify(data);
      if (dataString !== previousDataRef.current) {
        // Try to save (may not complete)
        navigator.sendBeacon?.(
          `/api/policies/${policyId}/steps/${step}`,
          JSON.stringify({ data, autoSave: true })
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [enabled, policyId, step, data]);

  return {
    ...state,
    saveNow,
    isSaving: state.status === "saving",
    isSaved: state.status === "saved",
    hasError: state.status === "error",
  };
}

// Utility component to display auto-save status
export function AutoSaveIndicator({ state }: { state: AutoSaveState }) {
  if (state.status === "idle") return null;

  return (
    <div className="flex items-center gap-2 text-sm">
      {state.status === "saving" && (
        <>
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          <span className="text-slate-500">Guardando...</span>
        </>
      )}
      {state.status === "saved" && (
        <>
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-slate-500">
            Guardado{" "}
            {state.lastSaved && (
              <span className="text-slate-400">
                {formatTimeAgo(state.lastSaved)}
              </span>
            )}
          </span>
        </>
      )}
      {state.status === "error" && (
        <>
          <div className="w-2 h-2 bg-red-500 rounded-full" />
          <span className="text-red-500">{state.error}</span>
        </>
      )}
    </div>
  );
}

// Helper to format time ago
function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "hace un momento";
  if (seconds < 3600) return `hace ${Math.floor(seconds / 60)} min`;
  return `hace ${Math.floor(seconds / 3600)} h`;
}
