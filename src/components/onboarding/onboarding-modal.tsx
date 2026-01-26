"use client";

import { useOnboarding } from "./onboarding-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  FileText,
  ListChecks,
  Download,
  User,
  ArrowRight,
  ArrowLeft,
  X,
} from "lucide-react";

const STEP_ICONS = [Sparkles, FileText, ListChecks, Download, User];

export function OnboardingModal() {
  const {
    isOnboarding,
    currentStep,
    steps,
    isReady,
    nextStep,
    prevStep,
    skipOnboarding,
  } = useOnboarding();

  // Don't render until storage check is complete
  if (!isReady || !isOnboarding) return null;

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  const Icon = STEP_ICONS[currentStep] || Sparkles;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <Dialog open={isOnboarding} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm text-slate-500">
                Paso {currentStep + 1} de {steps.length}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={skipOnboarding}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Progress value={progress} className="h-1 mb-4" />
          <DialogTitle className="text-xl">{step.title}</DialogTitle>
          <DialogDescription className="text-base">
            {step.description}
          </DialogDescription>
        </DialogHeader>

        {/* Visual illustration based on step */}
        <div className="py-6">
          {currentStep === 0 && (
            <div className="flex justify-center">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-3xl transform rotate-6"></div>
                <div className="absolute inset-0 bg-white rounded-3xl shadow-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-2">🛡️</div>
                    <p className="text-sm font-medium text-slate-600">
                      TratoDatos
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {currentStep === 1 && (
            <div className="flex justify-center gap-4">
              <div className="w-24 h-32 bg-slate-100 rounded-lg animate-pulse"></div>
              <div className="w-24 h-32 bg-indigo-100 rounded-lg border-2 border-indigo-500 flex items-center justify-center">
                <span className="text-3xl">+</span>
              </div>
              <div className="w-24 h-32 bg-slate-100 rounded-lg animate-pulse"></div>
            </div>
          )}
          {currentStep === 2 && (
            <div className="flex justify-center">
              <div className="space-y-2 w-full max-w-xs">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-2 rounded-lg ${
                      i <= 2 ? "bg-green-100" : "bg-slate-100"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        i <= 2
                          ? "bg-green-500 text-white"
                          : "bg-slate-300 text-slate-600"
                      }`}
                    >
                      {i <= 2 ? "✓" : i}
                    </div>
                    <div className="flex-1 h-3 bg-slate-200 rounded"></div>
                  </div>
                ))}
                <p className="text-xs text-center text-slate-500 mt-2">
                  ...y 7 pasos más
                </p>
              </div>
            </div>
          )}
          {currentStep === 3 && (
            <div className="flex justify-center gap-6">
              <div className="text-center">
                <div className="w-16 h-20 bg-red-100 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-2xl">📄</span>
                </div>
                <span className="text-xs text-slate-600">PDF</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-20 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-2xl">📝</span>
                </div>
                <span className="text-xs text-slate-600">Word</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-20 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-2xl">🌐</span>
                </div>
                <span className="text-xs text-slate-600">HTML</span>
              </div>
            </div>
          )}
          {currentStep === 4 && (
            <div className="flex justify-center">
              <div className="bg-slate-100 rounded-lg p-4 w-full max-w-xs">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-slate-200 rounded w-24 mb-1"></div>
                    <div className="h-2 bg-slate-200 rounded w-32"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-8 bg-white rounded flex items-center px-3 text-xs text-slate-500">
                    Mi Perfil
                  </div>
                  <div className="h-8 bg-white rounded flex items-center px-3 text-xs text-slate-500">
                    Facturación
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-row gap-2">
          {currentStep > 0 && (
            <Button variant="outline" onClick={prevStep} className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
          )}
          <Button
            onClick={nextStep}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600"
          >
            {isLastStep ? (
              "¡Empezar!"
            ) : (
              <>
                Siguiente
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </DialogFooter>

        <button
          onClick={skipOnboarding}
          className="text-xs text-slate-400 hover:text-slate-600 text-center w-full"
        >
          Omitir tutorial
        </button>
      </DialogContent>
    </Dialog>
  );
}
