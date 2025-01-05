import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/types/advertisement";
import { FormProgress } from "./FormProgress";
import { FormSteps } from "./FormSteps";
import { StepNavigation } from "./StepNavigation";

interface FormContainerProps {
  form: UseFormReturn<FormValues>;
  currentStep: number;
  isLoading: boolean;
  onSubmit: (values: FormValues) => Promise<void>;
  onPrevious: () => void;
  onNext: () => void;
  setIdentityDocument: (file: File | null) => void;
}

export const FormContainer = ({ 
  form, 
  currentStep, 
  isLoading, 
  onSubmit, 
  onPrevious, 
  onNext,
  setIdentityDocument
}: FormContainerProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormProgress currentStep={currentStep} totalSteps={4} />
        <FormSteps 
          currentStep={currentStep} 
          form={form} 
          setIdentityDocument={setIdentityDocument}
        />
        <StepNavigation
          currentStep={currentStep}
          totalSteps={4}
          onPrevious={onPrevious}
          onNext={onNext}
          isLoading={isLoading}
        />
      </form>
    </Form>
  );
};