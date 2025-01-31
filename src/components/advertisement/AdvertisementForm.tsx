import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormProgress } from "./form/FormProgress";
import { FormSteps } from "./form/FormSteps";
import { StepNavigation } from "./form/StepNavigation";
import { formSchema } from "./advertisementSchema";
import { FormValues, Advertisement } from "@/types/advertisement";
import { useAuthCheck } from "./hooks/useAuthCheck";
import { useFormValidation } from "./form/useFormValidation";
import { useFormSubmission } from "./form/useFormSubmission";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

type AdvertisementFormProps = {
  advertisement?: Advertisement;
  defaultValues?: Partial<FormValues>;
};

export const AdvertisementForm = ({ advertisement, defaultValues }: AdvertisementFormProps) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [identityDocument, setIdentityDocument] = useState<File | null>(null);
  const [showModerationAlert, setShowModerationAlert] = useState(false);
  const { user } = useAuthCheck();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: advertisement ? {
      ...defaultValues,
      ...advertisement,
      birthDate: advertisement.birth_date,
      hairColor: advertisement.hair_color,
      bodyType: advertisement.body_type,
      hourlyRate: advertisement.hourly_rate,
      services: advertisement.advertisement_services?.map(s => s.service) || [],
      serviceLocations: advertisement.advertisement_service_locations?.map(l => l.location) || [],
    } : defaultValues,
    mode: "onBlur",
  });

  const { validateStep } = useFormValidation(form);
  const { handleSubmit } = useFormSubmission(user, setShowModerationAlert, identityDocument, advertisement);

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      await handleSubmit(values);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <>
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
            onPrevious={handlePrevious}
            onNext={handleNext}
            isLoading={isLoading}
          />
        </form>
      </Form>

      <AlertDialog open={showModerationAlert} onOpenChange={setShowModerationAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anúncio Enviado para Moderação</AlertDialogTitle>
            <AlertDialogDescription>
              Seu anúncio foi criado com sucesso e está em análise. 
              Ele será publicado após aprovação da moderação.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => {
              setShowModerationAlert(false);
              navigate("/anuncios");
            }}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};