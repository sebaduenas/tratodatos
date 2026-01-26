"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for the element to highlight
  position?: "top" | "bottom" | "left" | "right";
  action?: string;
}

interface OnboardingContextType {
  isOnboarding: boolean;
  currentStep: number;
  steps: OnboardingStep[];
  isReady: boolean; // Added: indicates if storage check is complete
  startOnboarding: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipOnboarding: () => void;
  completeOnboarding: () => void;
  showTip: (tipId: string) => void;
  dismissTip: (tipId: string) => void;
  isDismissed: (tipId: string) => boolean;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "welcome",
    title: "¡Bienvenido a TratoDatos!",
    description:
      "Te guiaremos por las funciones principales para que puedas crear tu primera política de datos rápidamente.",
    position: "bottom",
  },
  {
    id: "create-policy",
    title: "Crear una Política",
    description:
      "Haz clic en 'Nueva Política' para comenzar a crear tu política de tratamiento de datos. El wizard te guiará paso a paso.",
    target: "[data-onboarding='new-policy']",
    position: "bottom",
  },
  {
    id: "wizard-steps",
    title: "12 Pasos Simples",
    description:
      "El wizard tiene 12 pasos que cubren todos los aspectos legales requeridos por la Ley 21.719. Puedes guardar tu progreso en cualquier momento.",
    position: "right",
  },
  {
    id: "export-options",
    title: "Exportar tu Política",
    description:
      "Una vez completada, podrás exportar tu política en PDF, Word o HTML para publicarla en tu sitio web.",
    position: "left",
  },
  {
    id: "profile-billing",
    title: "Perfil y Facturación",
    description:
      "En tu perfil puedes actualizar tus datos y en facturación puedes ver tu plan y actualizar a uno superior para más políticas.",
    target: "[data-onboarding='user-menu']",
    position: "bottom",
  },
];

const STORAGE_KEY = "tratodatos_onboarding";
const DISMISSED_TIPS_KEY = "tratodatos_dismissed_tips";

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [dismissedTips, setDismissedTips] = useState<string[]>([]);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const completed = localStorage.getItem(STORAGE_KEY);
    const dismissed = localStorage.getItem(DISMISSED_TIPS_KEY);

    if (dismissed) {
      try {
        setDismissedTips(JSON.parse(dismissed));
      } catch {
        setDismissedTips([]);
      }
    }

    // Auto-start onboarding for new users
    if (!completed) {
      setIsOnboarding(true);
    }

    setHasCheckedStorage(true);
  }, []);

  const startOnboarding = () => {
    setCurrentStep(0);
    setIsOnboarding(true);
  };

  const nextStep = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const skipOnboarding = () => {
    setIsOnboarding(false);
    localStorage.setItem(STORAGE_KEY, "skipped");
  };

  const completeOnboarding = () => {
    setIsOnboarding(false);
    localStorage.setItem(STORAGE_KEY, "completed");
  };

  const showTip = (tipId: string) => {
    // Tips are shown by default unless dismissed
  };

  const dismissTip = (tipId: string) => {
    const newDismissed = [...dismissedTips, tipId];
    setDismissedTips(newDismissed);
    localStorage.setItem(DISMISSED_TIPS_KEY, JSON.stringify(newDismissed));
  };

  const isDismissed = (tipId: string) => dismissedTips.includes(tipId);

  // Always provide the context, even while checking storage
  return (
    <OnboardingContext.Provider
      value={{
        isOnboarding,
        currentStep,
        steps: ONBOARDING_STEPS,
        isReady: hasCheckedStorage,
        startOnboarding,
        nextStep,
        prevStep,
        skipOnboarding,
        completeOnboarding,
        showTip,
        dismissTip,
        isDismissed,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
}
