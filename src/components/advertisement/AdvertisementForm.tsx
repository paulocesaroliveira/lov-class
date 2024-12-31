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
import { formSchema } from "./advertisementSchema";
import { StyleType, FormValues } from "@/types/advertisement";

type AdvertisementFormProps = {
  advertisement?: any; // Using any temporarily, should be properly typed
};

export const AdvertisementForm = ({ advertisement }: AdvertisementFormProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);

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
      description: "",
    },
  });

  const isValidStyle = (style: string): style is StyleType => {
    return ["patricinha", "nerd", "passista", "milf", "fitness", "ninfeta", "gordelicia"].includes(style);
  };

  // Initialize form with advertisement data when editing
  useState(() => {
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
        description: advertisement.description,
      });
    }
  }, [advertisement, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      console.log("Iniciando salvamento do anúncio com valores:", values);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error("Usuário não está logado");
        toast.error("Você precisa estar logado para criar um anúncio");
        navigate("/login");
        return;
      }

      console.log("Usuário autenticado:", user.id);

      let profilePhotoUrl = null;
      if (profilePhoto) {
        console.log("Fazendo upload da foto de perfil");
        const { data: profilePhotoData, error: profilePhotoError } =
          await supabase.storage
            .from("profile_photos")
            .upload(`${user.id}/${Date.now()}`, profilePhoto);

        if (profilePhotoError) {
          console.error("Erro no upload da foto de perfil:", profilePhotoError);
          throw profilePhotoError;
        }
        profilePhotoUrl = profilePhotoData.path;
        console.log("Foto de perfil salva com sucesso:", profilePhotoUrl);
      }

      const adData = {
        profile_id: user.id,
        name: values.name,
        birth_date: values.birthDate,
        height: values.height,
        weight: values.weight,
        category: values.category,
        whatsapp: values.whatsapp,
        state: values.state,
        city: values.city,
        neighborhood: values.neighborhood,
        hourly_rate: values.hourlyRate,
        custom_rate_description: values.customRates.length > 0
          ? JSON.stringify(values.customRates)
          : null,
        style: values.style,
        description: values.description,
        ...(profilePhotoUrl && { profile_photo_url: profilePhotoUrl }),
      };

      console.log("Salvando dados do anúncio:", adData);

      const { data: ad, error: adError } = advertisement
        ? await supabase
            .from("advertisements")
            .update(adData)
            .eq("id", advertisement.id)
            .select()
            .single()
        : await supabase
            .from("advertisements")
            .insert(adData)
            .select()
            .single();

      if (adError) {
        console.error("Erro ao salvar anúncio:", adError);
        throw adError;
      }

      console.log("Anúncio salvo com sucesso:", ad);

      if (advertisement) {
        console.log("Removendo serviços antigos");
        await supabase
          .from("advertisement_services")
          .delete()
          .eq("advertisement_id", advertisement.id);
      }

      console.log("Salvando serviços:", values.services);
      const { error: servicesError } = await supabase
        .from("advertisement_services")
        .insert(
          values.services.map((service) => ({
            advertisement_id: ad.id,
            service,
          }))
        );

      if (servicesError) {
        console.error("Erro ao salvar serviços:", servicesError);
        throw servicesError;
      }

      if (photos.length > 0) {
        console.log("Processando fotos:", photos.length);
        if (advertisement) {
          await supabase
            .from("advertisement_photos")
            .delete()
            .eq("advertisement_id", advertisement.id);
        }

        const photoUploads = photos.map((photo) =>
          supabase.storage
            .from("ad_photos")
            .upload(`${ad.id}/${Date.now()}-${photo.name}`, photo)
        );

        const photoResults = await Promise.all(photoUploads);
        const photoUrls = photoResults
          .map((result) => result.data?.path)
          .filter(Boolean);

        console.log("Fotos enviadas:", photoUrls);

        const { error: photosError } = await supabase
          .from("advertisement_photos")
          .insert(
            photoUrls.map((url) => ({
              advertisement_id: ad.id,
              photo_url: url,
            }))
          );

        if (photosError) {
          console.error("Erro ao salvar fotos:", photosError);
          throw photosError;
        }
      }

      if (videos.length > 0) {
        console.log("Processando vídeos:", videos.length);
        if (advertisement) {
          await supabase
            .from("advertisement_videos")
            .delete()
            .eq("advertisement_id", advertisement.id);
        }

        const videoUploads = videos.map((video) =>
          supabase.storage
            .from("ad_videos")
            .upload(`${ad.id}/${Date.now()}-${video.name}`, video)
        );

        const videoResults = await Promise.all(videoUploads);
        const videoUrls = videoResults
          .map((result) => result.data?.path)
          .filter(Boolean);

        console.log("Vídeos enviados:", videoUrls);

        const { error: videosError } = await supabase
          .from("advertisement_videos")
          .insert(
            videoUrls.map((url) => ({
              advertisement_id: ad.id,
              video_url: url,
            }))
          );

        if (videosError) {
          console.error("Erro ao salvar vídeos:", videosError);
          throw videosError;
        }
      }

      toast.success(
        advertisement 
          ? "Anúncio atualizado com sucesso!" 
          : "Anúncio criado com sucesso!"
      );
      navigate("/anuncios");
    } catch (error) {
      console.error("Erro detalhado ao criar/atualizar anúncio:", error);
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