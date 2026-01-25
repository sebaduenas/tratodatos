"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { WIZARD_STEPS } from "@/types/policy";
import {
  Building2,
  Database,
  Users,
  Target,
  Scale,
  Share2,
  Globe,
  Clock,
  Download,
  Cpu,
  Shield,
  CheckCircle,
  Circle,
  Lock,
} from "lucide-react";

const stepIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Database,
  Users,
  Target,
  Scale,
  Share2,
  Globe,
  Clock,
  Download,
  Cpu,
  Shield,
  CheckCircle,
};

interface WizardSidebarProps {
  currentStep: number;
  completedSteps: number[];
  policyId: string;
}

export function WizardSidebar({
  currentStep,
  completedSteps,
  policyId,
}: WizardSidebarProps) {
  const canAccessStep = (stepNumber: number) => {
    if (stepNumber === 1) return true;
    return completedSteps.includes(stepNumber - 1) || completedSteps.includes(stepNumber);
  };

  return (
    <div className="hidden lg:block">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sticky top-36">
        <h3 className="font-semibold text-slate-900 mb-4 px-2">Pasos del Wizard</h3>
        <nav className="space-y-1">
          {WIZARD_STEPS.map((step) => {
            const Icon = stepIcons[step.icon] || Circle;
            const isCompleted = completedSteps.includes(step.number);
            const isCurrent = currentStep === step.number;
            const isAccessible = canAccessStep(step.number);

            return (
              <Link
                key={step.number}
                href={
                  isAccessible
                    ? `/dashboard/wizard/${policyId}/${step.number}`
                    : "#"
                }
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                  isCurrent
                    ? "bg-indigo-50 text-indigo-700"
                    : isAccessible
                    ? "hover:bg-slate-50 text-slate-700"
                    : "text-slate-400 cursor-not-allowed"
                )}
                onClick={(e) => {
                  if (!isAccessible) e.preventDefault();
                }}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                    isCompleted
                      ? "bg-green-100 text-green-600"
                      : isCurrent
                      ? "bg-indigo-100 text-indigo-600"
                      : isAccessible
                      ? "bg-slate-100 text-slate-500"
                      : "bg-slate-50 text-slate-300"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : !isAccessible ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-medium truncate",
                      isCurrent && "text-indigo-700"
                    )}
                  >
                    {step.number}. {step.title}
                  </p>
                  <p
                    className={cn(
                      "text-xs truncate",
                      isCurrent ? "text-indigo-500" : "text-slate-500"
                    )}
                  >
                    {step.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
