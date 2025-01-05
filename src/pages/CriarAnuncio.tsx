import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormContainer } from "@/components/advertisement/form/FormContainer";
import { ModerationAlert } from "@/components/advertisement/form/ModerationAlert";
import { formSchema } from "@/components/advertisement/advertisementSchema";
import { FormValues } from "@/types/advertisement";
import { useAuthCheck } from "@/components/advertisement/hooks/useAuthCheck";
import { useFormValidation } from "@/components/advertisement/form/useFormValidation";
import { useFormSubmission } from "@/components/advertisement/form/useFormSubmission";

const CriarAnuncio = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModerationAlert, setShowModerationAlert] = useState(false);
  const [identityDocument, setIdentityDocument] = useState<File | null>(null);
  const { user } = useAuthCheck();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
  const { handleSubmit } = useFormSubmission(user, setShowModerationAlert, identityDocument);

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
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-4xl mx-auto space-y-8 p-4 md:p-8">
        {/* Header with gradient text */}
        <div className="space-y-2 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Criar Anúncio
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Preencha as informações abaixo para criar seu anúncio
          </p>
        </div>

        {/* Decorative elements */}
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
          
          {/* Form container with glass effect */}
          <div className="relative backdrop-blur-sm">
            <FormContainer
              form={form}
              currentStep={currentStep}
              isLoading={isLoading}
              onSubmit={onSubmit}
              onPrevious={handlePrevious}
              onNext={handleNext}
              setIdentityDocument={setIdentityDocument}
            />
          </div>
        </div>
      </div>

      <ModerationAlert 
        open={showModerationAlert} 
        onOpenChange={setShowModerationAlert} 
      />
    </div>
  );
};

export default CriarAnuncio;