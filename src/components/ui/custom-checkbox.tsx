"use client";

interface CustomCheckboxProps {
  checked: boolean;
  color?: "indigo" | "amber" | "purple";
  className?: string;
}

export function CustomCheckbox({ checked, color = "indigo", className = "" }: CustomCheckboxProps) {
  const colorClasses = {
    indigo: checked ? "bg-indigo-600 border-indigo-600" : "border-slate-300",
    amber: checked ? "bg-amber-600 border-amber-600" : "border-slate-300",
    purple: checked ? "bg-purple-600 border-purple-600" : "border-slate-300",
  };

  return (
    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${colorClasses[color]} ${className}`}>
      {checked && (
        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
    </div>
  );
}
