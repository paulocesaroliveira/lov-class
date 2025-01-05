import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
import { formSchema } from "./advertisementSchema";
import { FormValues } from "@/types/advertisement";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { useAdvertisementOperations } from "@/hooks/useAdvertisementOperations";
import { useAuthCheck } from "./hooks/useAuthCheck";
import { ServiceType, ServiceLocationType } from "@/integrations/supabase/types/enums";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type AdvertisementFormProps = {
  advertisement?: FormValues;
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
      whatsapp: "",
      state: "",
      city: "",
      neighborhood: "",
      hourlyRate: 200,
      customRates: [],
      style: "patricinha",
      services: [] as ServiceType[],
      serviceLocations: [] as ServiceLocationType[],
      description: "",
    },
    mode: "onBlur",
  });

  const {
    profilePhoto,
    setProfilePhoto,
    photos,
    setPhotos,
    videos,
    setVideos,
    uploadProfilePhoto,
    uploadPhotos,
    uploadVideos,
  } = useMediaUpload(user?.id);

  const {
    saveAdvertisement,
    saveServices,
    saveServiceLocations,
    savePhotos,
    saveVideos,
    deleteExistingMedia,
  } = useAdvertisementOperations();

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      console.log("Iniciando " + (advertisement ? "atualização" : "criação") + " do anúncio com valores:", values);

      if (!user) {
        console.error("Usuário não está logado");
        toast.error("Você precisa estar logado para " + (advertisement ? "atualizar" : "criar") + " um anúncio");
        navigate("/login");
        return;
      }

      if (!identityDocument && !advertisement) {
        toast.error("Por favor, envie uma foto do seu documento de identidade");
        return;
      }

      console.log("Usuário autenticado:", user.id);

      // Upload do documento de identidade
      if (identityDocument) {
        const documentFileName = `${user.id}/${Date.now()}-${identityDocument.name}`;
        const { error: documentError } = await supabase.storage
          .from("identity_documents")
          .upload(documentFileName, identityDocument);

        if (documentError) {
          console.error("Erro ao enviar documento:", documentError);
          toast.error("Erro ao enviar documento de identidade");
          return;
        }

        // Salvar referência do documento
        const { error: docRefError } = await supabase
          .from("advertiser_documents")
          .insert({
            advertisement_id: advertisement?.id,
            document_url: documentFileName,
          });

        if (docRefError) {
          console.error("Erro ao salvar referência do documento:", docRefError);
          toast.error("Erro ao salvar referência do documento");
          return;
        }
      }

      const profilePhotoUrl = await uploadProfilePhoto();
      console.log("Foto de perfil enviada:", profilePhotoUrl);
      
      if (advertisement?.id) {
        await deleteExistingMedia(advertisement.id);
      }

      const formValues = advertisement?.id ? { ...values, id: advertisement.id } : values;
      console.log("Salvando anúncio com valores:", formValues);
      
      const ad = await saveAdvertisement(formValues, user.id, profilePhotoUrl, !!advertisement);
      console.log("Anúncio salvo com sucesso:", ad);
      
      await saveServices(ad.id, values.services as ServiceType[]);
      console.log("Serviços salvos com sucesso");
      
      await saveServiceLocations(ad.id, values.serviceLocations as ServiceLocationType[]);
      console.log("Locais de atendimento salvos com sucesso");

      const photoUrls = await uploadPhotos(ad.id);
      console.log("Fotos enviadas:", photoUrls);
      
      const videoUrls = await uploadVideos(ad.id);
      console.log("Vídeos enviados:", videoUrls);

      await savePhotos(ad.id, photoUrls);
      await saveVideos(ad.id, videoUrls);

      if (!advertisement) {
        setShowModerationAlert(true);
      } else {
        toast.success("Anúncio atualizado com sucesso!");
        navigate("/anuncios");
      }
    } catch (error: any) {
      console.error("Erro detalhado ao " + (advertisement ? "atualizar" : "criar") + " anúncio:", error);
      toast.error(`Erro ao ${advertisement ? 'atualizar' : 'criar'} anúncio: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    const fields = form.getValues();
    const isValid = await form.trigger();
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
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
            <ContactLocation form={form} />
          </FormStep>

          <FormStep isActive={currentStep === 2}>
            <MediaUpload
              setProfilePhoto={setProfilePhoto}
              setPhotos={setPhotos}
              setVideos={setVideos}
            />
            <IdentityDocument 
              form={form} 
              setIdentityDocument={setIdentityDocument} 
            />
          </FormStep>

          <FormStep isActive={currentStep === 3}>
            <CustomRates form={form} />
            <StyleSelection form={form} />
            <ServicesSelection form={form} />
            <ServiceLocations form={form} />
          </FormStep>

          <FormStep isActive={currentStep === 4}>
            <Description form={form} />
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
