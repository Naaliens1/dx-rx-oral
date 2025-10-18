import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface DiagnosticStepperProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
}

export const DiagnosticStepper = ({ currentStep, totalSteps, completedSteps }: DiagnosticStepperProps) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = completedSteps.includes(index);
          const isCurrent = currentStep === index;
          
          return (
            <div key={index} className="flex items-center flex-1">
              <div className="flex flex-col items-center relative">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                    isCompleted && "bg-success text-success-foreground",
                    isCurrent && !isCompleted && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                    !isCurrent && !isCompleted && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : stepNumber}
                </div>
                <span className={cn(
                  "text-xs mt-2 font-medium absolute top-12 whitespace-nowrap",
                  isCurrent ? "text-foreground" : "text-muted-foreground"
                )}>
                  Paso {stepNumber}
                </span>
              </div>
              {index < totalSteps - 1 && (
                <div className="flex-1 h-0.5 mx-2">
                  <div
                    className={cn(
                      "h-full transition-all duration-300",
                      isCompleted ? "bg-success" : "bg-border"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
