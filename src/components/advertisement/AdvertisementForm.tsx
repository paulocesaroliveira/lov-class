import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { BasicInformation } from "./BasicInformation";
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
  advertisement?: FormValues & {
    advertisement_services: { service: string }[];
    advertisement_service_locations: { location: string }[];
    advertisement_photos: { photo_url: string }[];
    advertisement_videos: { video_url: string }[];
  };
};

export const AdvertisementForm = ({ advertisement }: AdvertisementFormProps = {}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: advertisement || {
      name: "",
      birthDate: "",
      height: 170,
      weight: 65,
      category: "mulher",
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
  } = useMediaUpload();

  const {
    saveAdvertisement,
    saveServices,
    saveServiceLocations,
    savePhotos,
    saveVideos,
  } = useAdvertisementOperations();

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      console.log("Iniciando criação do anúncio com valores:", values);

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.error("Usuário não está logado");
        toast.error("Você precisa estar logado para criar um anúncio");
        navigate("/login");
        return;
      }

      console.log("Usuário autenticado:", user.id);

      const profilePhotoUrl = await uploadProfilePhoto();
      
      const ad = await saveAdvertisement(values, user.id, profilePhotoUrl);
      await saveServices(ad.id, values.services);
      await saveServiceLocations(ad.id, values.serviceLocations);

      const photoUrls = await uploadPhotos(ad.id);
      const videoUrls = await uploadVideos(ad.id);

      await savePhotos(ad.id, photoUrls);
      await saveVideos(ad.id, videoUrls);

      toast.success("Anúncio criado com sucesso!");
      navigate("/anuncios");
    } catch (error) {
      console.error("Erro detalhado ao criar anúncio:", error);
      toast.error(`Erro ao criar anúncio: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicInformation form={form} />
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