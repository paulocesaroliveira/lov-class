import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormProgress } from "./form/FormProgress";
import { FormStep } from "./form/FormStep";
import { StepNavigation } from "./form/StepNavigation";
import { BasicInformation } from "./BasicInformation";
import { Appearance } from "./Appearance";
import { ContactLocation } from "./ContactLocation";
import { CustomRates } from "./CustomRates";
import { ServicesSelection } from "./ServicesSelection";
import { StyleSelection } from "./StyleSelection";
import { Description } from "./Description";
import { MediaUpload } from "./MediaUpload";
import { ServiceLocations } from "./ServiceLocations";
import { IdentityDocument } from "./IdentityDocument";
import { ContactOptions } from "./ContactOptions";
import { TermsAndConditions } from "./TermsAndConditions";
import { formSchema } from "./advertisementSchema";
import { FormValues } from "@/types/advertisement";
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
  advertisement?: any;
};

export const AdvertisementForm = ({ advertisement }: AdvertisementFormProps) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [identityDocument, setIdentityDocument] = useState<File | null>(null);
  const [showModerationAlert, setShowModerationAlert] = useState(false);
  const { user } = useAuthCheck();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: advertisement || {
      name: "",
      birthDate: "",
      height: 170,
      weight: 65,
      category: "mulher",
      ethnicity: "branca",
      hairColor: "morena",
      bodyType: "magra",
      silicone: "nao_uso",
      contact_phone: "",
      contact_whatsapp: true,
      contact_telegram: false,
      state: "",
      city: "",
      neighborhood: "",
      hourlyRate: 200,
      customRates: [],
      style: "patricinha",
      services: [],
      serviceLocations: [],
      description: "",
      acceptTerms: false,
    },
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

          <FormStep isActive={currentStep === 1}>
            <BasicInformation form={form} />
            <Appearance form={form} />
            <ContactOptions form={form} />
            <ContactLocation form={form} />
          </FormStep>

          <FormStep isActive={currentStep === 2}>
            <CustomRates form={form} />
            <StyleSelection form={form} />
            <ServicesSelection form={form} />
            <ServiceLocations form={form} />
            <Description form={form} />
          </FormStep>

          <FormStep isActive={currentStep === 3}>
            <MediaUpload
              setProfilePhoto={form.setValue}
              setPhotos={form.setValue}
              setVideos={form.setValue}
            />
            <IdentityDocument 
              form={form} 
              setIdentityDocument={setIdentityDocument} 
            />
          </FormStep>

          <FormStep isActive={currentStep === 4}>
            <TermsAndConditions form={form} />
          </FormStep>

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