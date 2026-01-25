"use client";

import { useCallback, useEffect, useRef } from "react";

// Generate a unique session ID
function generateSessionId(): string {
  if (typeof window === "undefined") return "";
  
  let sessionId = sessionStorage.getItem("wizard_session_id");
  if (!sessionId) {
    sessionId = `ws_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("wizard_session_id", sessionId);
  }
  return sessionId;
}

interface UseWizardAnalyticsOptions {
  policyId: string;
  step: number;
  enabled?: boolean;
}

export function useWizardAnalytics({
  policyId,
  step,
  enabled = true,
}: UseWizardAnalyticsOptions) {
  const sessionIdRef = useRef<string>("");
  const stepStartTimeRef = useRef<number>(0);
  const hasTrackedStartRef = useRef(false);

  // Initialize session ID
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionIdRef.current = generateSessionId();
    }
  }, []);

  // Track step start
  useEffect(() => {
    if (!enabled || hasTrackedStartRef.current) return;

    stepStartTimeRef.current = Date.now();
    hasTrackedStartRef.current = true;

    // Track step started
    fetch("/api/analytics/wizard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: sessionIdRef.current,
        policyId,
        step,
        action: "started",
      }),
    }).catch(() => {}); // Ignore errors

    return () => {
      hasTrackedStartRef.current = false;
    };
  }, [enabled, policyId, step]);

  // Track step completion
  const trackCompletion = useCallback(() => {
    if (!enabled) return;

    const timeSpent = Math.round((Date.now() - stepStartTimeRef.current) / 1000);

    fetch("/api/analytics/wizard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: sessionIdRef.current,
        policyId,
        step,
        action: "completed",
        timeSpentSec: timeSpent,
      }),
    }).catch(() => {});
  }, [enabled, policyId, step]);

  // Track error
  const trackError = useCallback(
    (errorMessage: string) => {
      if (!enabled) return;

      fetch("/api/analytics/wizard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          policyId,
          step,
          action: "error",
          errorMessage,
        }),
      }).catch(() => {});
    },
    [enabled, policyId, step]
  );

  // Track abandonment on unmount (if not completed)
  useEffect(() => {
    return () => {
      if (!enabled) return;

      // Use sendBeacon for reliable tracking on page unload
      const data = JSON.stringify({
        sessionId: sessionIdRef.current,
        policyId,
        step,
        action: "abandoned",
      });

      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/analytics/wizard", data);
      }
    };
  }, [enabled, policyId, step]);

  return {
    trackCompletion,
    trackError,
    sessionId: sessionIdRef.current,
  };
}
