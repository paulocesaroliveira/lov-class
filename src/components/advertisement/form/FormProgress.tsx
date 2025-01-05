import { Check } from "lucide-react";

type FormProgressProps = {
  currentStep: number;
  totalSteps: number;
};

export const FormProgress = ({ currentStep, totalSteps }: FormProgressProps) => {
  const stepLabels = [
    "Informações Básicas",
    "Serviços e Valores",
    "Mídia",
    "Descrição"
  ];

  return (
    <div className="w-full mb-8">
      <div className="relative">
        {/* Progress bar background */}
        <div className="h-2 bg-secondary rounded-full" />
        
        {/* Active progress */}
        <div 
          className="absolute top-0 h-2 bg-primary rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
        
        {/* Step indicators */}
        <div className="absolute top-0 w-full flex justify-between -mt-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                index < currentStep
                  ? "bg-primary border-primary text-white"
                  : index === currentStep
                  ? "bg-background border-primary"
                  : "bg-background border-secondary"
              }`}
            >
              {index < currentStep ? (
                <Check className="w-3 h-3" />
              ) : (
                <span className="text-xs">{index + 1}</span>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Step labels */}
      <div className="mt-4 flex justify-between text-sm text-muted-foreground">
        {stepLabels.map((label, index) => (
          <span key={index} className="text-center">{label}</span>
        ))}
      </div>
    </div>
  );
};