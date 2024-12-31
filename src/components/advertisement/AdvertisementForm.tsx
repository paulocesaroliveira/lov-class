import { useState, useEffect } from "react";
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
import { StyleType, FormValues } from "@/types/advertisement";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { useAdvertisementOperations } from "@/hooks/useAdvertisementOperations";

type AdvertisementFormProps = {
  advertisement?: any;
};

export const AdvertisementForm = ({ advertisement }: AdvertisementFormProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
      style: "patricinha" as StyleType,
      services: [],
      serviceLocations: [],
      description: "",
    },
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
  } = useMediaUpload(advertisement?.profile_id);

  const {
    saveAdvertisement,
    saveServices,
    saveServiceLocations,
    savePhotos,
    saveVideos,
    deleteExistingMedia,
  } = useAdvertisementOperations();

  const isValidStyle = (style: string): style is StyleType => {
    return ["patricinha", "nerd", "passista", "milf", "fitness", "ninfeta", "gordelicia"].includes(style);
  };

  useEffect(() => {
    if (advertisement) {
      console.log("Carregando dados do anúncio existente:", advertisement);
      const customRates = advertisement.custom_rate_description
        ? JSON.parse(advertisement.custom_rate_description)
        : [];

      const style = advertisement.style;
      if (!isValidStyle(style)) {
        console.error("Estilo inválido:", style);
        return;
      }

      const fetchServiceLocations = async () => {
        const { data: serviceLocations, error } = await supabase
          .from('advertisement_service_locations')
          .select('location')
          .eq('advertisement_id', advertisement.id);

        if (error) {
          console.error("Erro ao carregar locais de atendimento:", error);
          return;
        }

        const locations = serviceLocations.map(sl => sl.location);
        console.log("Locais de atendimento carregados:", locations);

        form.reset({
          name: advertisement.name,
          birthDate: advertisement.birth_date,
          height: Number(advertisement.height),
          weight: Number(advertisement.weight),
          category: advertisement.category,
          whatsapp: advertisement.whatsapp,
          state: advertisement.state,
          city: advertisement.city,
          neighborhood: advertisement.neighborhood,
          hourlyRate: Number(advertisement.hourly_rate),
          customRates,
          style,
          services: advertisement.advertisement_services.map((s: any) => s.service),
          serviceLocations: locations,
          description: advertisement.description,
        });
      };

      fetchServiceLocations();
    }
  }, [advertisement, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      console.log("Iniciando " + (advertisement ? "atualização" : "criação") + " do anúncio com valores:", values);

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.error("Usuário não está logado");
        toast.error("Você precisa estar logado para " + (advertisement ? "atualizar" : "criar") + " um anúncio");
        navigate("/login");
        return;
      }

      console.log("Usuário autenticado:", user.id);

      const profilePhotoUrl = await uploadProfilePhoto();

      if (advertisement?.id) {
        await deleteExistingMedia(advertisement.id);
      }

      const ad = await saveAdvertisement(
        values,
        user.id,
        profilePhotoUrl,
        !!advertisement,
        advertisement?.id
      );

      await saveServices(ad.id, values.services);
      await saveServiceLocations(ad.id, values.serviceLocations);

      const photoUrls = await uploadPhotos(ad.id);
      const videoUrls = await uploadVideos(ad.id);

      await savePhotos(ad.id, photoUrls);
      await saveVideos(ad.id, videoUrls);

      toast.success(
        advertisement 
          ? "Anúncio atualizado com sucesso!" 
          : "Anúncio criado com sucesso!"
      );
      navigate("/anuncios");
    } catch (error) {
      console.error("Erro detalhado ao " + (advertisement ? "atualizar" : "criar") + " anúncio:", error);
      toast.error(
        advertisement
          ? `Erro ao atualizar anúncio: ${error.message || 'Erro desconhecido'}`
          : `Erro ao criar anúncio: ${error.message || 'Erro desconhecido'}`
      );
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