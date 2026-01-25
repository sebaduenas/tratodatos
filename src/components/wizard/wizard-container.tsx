"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  CheckCircle,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useWizardStore } from "@/store/wizard-store";
import { WIZARD_STEPS, type Policy } from "@/types/policy";
import { WizardSidebar } from "./wizard-sidebar";
import { Step01Form } from "./steps/step-01";
import { Step02Form } from "./steps/step-02";
import { Step03Form } from "./steps/step-03";
import { Step04Form } from "./steps/step-04";
import { Step05Form } from "./steps/step-05";
import { Step06Form } from "./steps/step-06";
import { Step07Form } from "./steps/step-07";
import { Step08Form } from "./steps/step-08";
import { Step09Form } from "./steps/step-09";
import { Step10Form } from "./steps/step-10";
import { Step11Form } from "./steps/step-11";
import { Step12Form } from "./steps/step-12";

interface WizardContainerProps {
  policy: Policy;
  currentStep: number;
  user: {
    id: string;
    subscriptionTier: string;
  };
}

const stepComponents: Record<number, React.ComponentType<{ policyId: string }>> = {
  1: Step01Form,
  2: Step02Form,
  3: Step03Form,
  4: Step04Form,
  5: Step05Form,
  6: Step06Form,
  7: Step07Form,
  8: Step08Form,
  9: Step09Form,
  10: Step10Form,
  11: Step11Form,
  12: Step12Form,
};

export function WizardContainer({
  policy,
  currentStep,
  user,
}: WizardContainerProps) {
  const router = useRouter();
  const { loadPolicy, completedSteps, getCompletionPercentage } = useWizardStore();

  useEffect(() => {
    loadPolicy({
      id: policy.id,
      name: policy.name,
      currentStep: policy.currentStep,
      completedSteps: policy.completedSteps,
      step01Data: policy.step01Data,
      step02Data: policy.step02Data,
      step03Data: policy.step03Data,
      step04Data: policy.step04Data,
      step05Data: policy.step05Data,
      step06Data: policy.step06Data,
      step07Data: policy.step07Data,
      step08Data: policy.step08Data,
      step09Data: policy.step09Data,
      step10Data: policy.step10Data,
      step11Data: policy.step11Data,
      step12Data: policy.step12Data,
    });
  }, [policy, loadPolicy]);

  const stepInfo = WIZARD_STEPS[currentStep - 1];
  const StepComponent = stepComponents[currentStep];
  const completionPct = getCompletionPercentage();

  const canGoBack = currentStep > 1;
  const canGoForward = currentStep < 12 && completedSteps.includes(currentStep);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Home className="w-4 h-4" />
                  <span className="hidden md:inline">Dashboard</span>
                </Button>
              </Link>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <h1 className="font-semibold text-slate-900">{policy.name}</h1>
                <p className="text-sm text-slate-500">
                  Paso {currentStep} de 12: {stepInfo.title}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                <Progress value={completionPct} className="w-32 h-2" />
                <span className="text-sm text-slate-500">{completionPct}%</span>
              </div>
              {completedSteps.includes(currentStep) && (
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Guardado
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <WizardSidebar
            currentStep={currentStep}
            completedSteps={completedSteps}
            policyId={policy.id}
          />

          {/* Main Content */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  {stepInfo.title}
                </h2>
                <p className="text-slate-600 mt-1">{stepInfo.description}</p>
              </div>

              <StepComponent policyId={policy.id} />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                disabled={!canGoBack}
                onClick={() =>
                  router.push(`/dashboard/wizard/${policy.id}/${currentStep - 1}`)
                }
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>

              {currentStep === 12 ? (
                <Link href={`/dashboard/wizard/${policy.id}/preview`}>
                  <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700">
                    Ver Vista Previa
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Button
                  disabled={!canGoForward}
                  onClick={() =>
                    router.push(`/dashboard/wizard/${policy.id}/${currentStep + 1}`)
                  }
                >
                  Siguiente
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
