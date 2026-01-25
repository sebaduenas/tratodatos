"use client";

import { OnboardingProvider } from "./onboarding-provider";
import { OnboardingModal } from "./onboarding-modal";

export function OnboardingWrapper({ children }: { children: React.ReactNode }) {
  return (
    <OnboardingProvider>
      {children}
      <OnboardingModal />
    </OnboardingProvider>
  );
}

export { ContextualTip } from "./contextual-tip";
export { useOnboarding } from "./onboarding-provider";
