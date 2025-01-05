import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";

type StepNavigationProps = {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  isLoading?: boolean;
};

export const StepNavigation = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isLoading
}: StepNavigationProps) => {
  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;

  const handleNext = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNext();
  };

  const handlePrevious = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onPrevious();
  };

  return (
    <div className="flex justify-between pt-6">
      <Button
        type="button"
        variant="outline"
        onClick={handlePrevious}
        disabled={isFirstStep}
        className="w-32"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Anterior
      </Button>

      <Button
        type={isLastStep ? "submit" : "button"}
        onClick={!isLastStep ? handleNext : undefined}
        disabled={isLoading}
        className="w-32"
      >
        {isLastStep ? (
          <>
            Publicar
            <Send className="w-4 h-4 ml-2" />
          </>
        ) : (
          <>
            Próximo
            <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
};