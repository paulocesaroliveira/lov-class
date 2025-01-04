import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { BasicInformation } from "./BasicInformation";
import { Appearance } from "./Appearance";
import { ContactLocation } from "./ContactLocation";
import { CustomRates } from "./CustomRates";
import { ServicesSelection } from "./ServicesSelection";
import { StyleSelection } from "./StyleSelection";
import { Description } from "./Description";
import { MediaUpload } from "./MediaUpload";
import { FormActions } from "./FormActions";
import { ServiceLocations } from "./ServiceLocations";
import { IdentityDocument } from "./IdentityDocument";
import { formSchema } from "./advertisementSchema";
import { FormValues } from "@/types/advertisement";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { useAdvertisementOperations } from "@/hooks/useAdvertisementOperations";

type AdvertisementFormProps = {
  advertisement?: FormValues;
};

export const AdvertisementForm = ({ advertisement }: AdvertisementFormProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [identityDocument, setIdentityDocument] = useState<File | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error("Erro ao obter usuário:", error);
          toast.error("Erro ao verificar autenticação");
          navigate("/login");
          return;
        }

        if (!user) {
          toast.error("Você precisa estar logado para criar um anúncio");
          navigate("/login");
          return;
        }

        console.log("Usuário autenticado:", user.id);
        setUser(user);
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        toast.error("Erro ao verificar autenticação");
        navigate("/login");
      }
    };
    getUser();
  }, [navigate]);
  
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
      services: [],
      serviceLocations: [],
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

      // Passar o ID do anúncio existente para atualização
      const formValues = advertisement?.id ? { ...values, id: advertisement.id } : values;
      console.log("Salvando anúncio com valores:", formValues);
      
      const ad = await saveAdvertisement(formValues, user.id, profilePhotoUrl, !!advertisement);
      console.log("Anúncio salvo com sucesso:", ad);
      
      await saveServices(ad.id, values.services);
      console.log("Serviços salvos com sucesso");
      
      await saveServiceLocations(ad.id, values.serviceLocations);
      console.log("Locais de atendimento salvos com sucesso");

      const photoUrls = await uploadPhotos(ad.id);
      console.log("Fotos enviadas:", photoUrls);
      
      const videoUrls = await uploadVideos(ad.id);
      console.log("Vídeos enviados:", videoUrls);

      await savePhotos(ad.id, photoUrls);
      await saveVideos(ad.id, videoUrls);

      toast.success(advertisement ? "Anúncio atualizado com sucesso!" : "Anúncio criado com sucesso!");
      navigate("/anuncios");
    } catch (error: any) {
      console.error("Erro detalhado ao " + (advertisement ? "atualizar" : "criar") + " anúncio:", error);
      toast.error(`Erro ao ${advertisement ? 'atualizar' : 'criar'} anúncio: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicInformation form={form} />
        <Appearance form={form} />
        <ContactLocation form={form} />
        <CustomRates form={form} />
        <StyleSelection form={form} />
        <ServicesSelection form={form} />
        <ServiceLocations form={form} />
        <Description form={form} />
        <IdentityDocument form={form} setIdentityDocument={setIdentityDocument} />
        <MediaUpload
          setProfilePhoto={setProfilePhoto}
          setPhotos={setPhotos}
          setVideos={setVideos}
        />
        <FormActions isLoading={isLoading} isEditing={!!advertisement} />
      </form>
    </Form>
  );
};
