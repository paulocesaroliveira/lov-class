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

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Você precisa estar logado para criar um anúncio");
        navigate("/login");
        return;
      }
      setUser(user);
    };
    getUser();
  }, [navigate]);

  console.log("Dados do anúncio recebidos no formulário:", advertisement);
  
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

  console.log("Valores padrão do formulário:", form.getValues());

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

      console.log("Usuário autenticado:", user.id);

      const profilePhotoUrl = await uploadProfilePhoto();
      
      if (advertisement) {
        await deleteExistingMedia(advertisement.id);
      }

      const ad = await saveAdvertisement(values, user.id, profilePhotoUrl, !!advertisement);
      await saveServices(ad.id, values.services);
      await saveServiceLocations(ad.id, values.serviceLocations);

      const photoUrls = await uploadPhotos(ad.id);
      const videoUrls = await uploadVideos(ad.id);

      await savePhotos(ad.id, photoUrls);
      await saveVideos(ad.id, videoUrls);

      toast.success(advertisement ? "Anúncio atualizado com sucesso!" : "Anúncio criado com sucesso!");
      navigate("/anuncios");
    } catch (error) {
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