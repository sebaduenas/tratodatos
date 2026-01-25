"use client";

import { useState } from "react";
import { useOnboarding } from "./onboarding-provider";
import { X, Lightbulb } from "lucide-react";

interface ContextualTipProps {
  id: string;
  title: string;
  description: string;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function ContextualTip({
  id,
  title,
  description,
  position = "bottom",
  className = "",
}: ContextualTipProps) {
  const { dismissTip, isDismissed } = useOnboarding();
  const [isVisible, setIsVisible] = useState(true);

  if (isDismissed(id) || !isVisible) {
    return null;
  }

  const positionClasses = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
    right: "left-full ml-2",
  };

  const handleDismiss = () => {
    setIsVisible(false);
    dismissTip(id);
  };

  return (
    <div
      className={`absolute z-50 ${positionClasses[position]} ${className}`}
      role="tooltip"
    >
      <div className="bg-indigo-600 text-white rounded-lg shadow-lg p-4 max-w-xs animate-in fade-in slide-in-from-top-2">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-medium text-sm">{title}</h4>
              <button
                onClick={handleDismiss}
                className="text-indigo-200 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-indigo-100">{description}</p>
          </div>
        </div>
        {/* Arrow */}
        {position === "bottom" && (
          <div className="absolute -top-2 left-6 w-4 h-4 bg-indigo-600 transform rotate-45"></div>
        )}
        {position === "top" && (
          <div className="absolute -bottom-2 left-6 w-4 h-4 bg-indigo-600 transform rotate-45"></div>
        )}
      </div>
    </div>
  );
}
