import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { BasicInformation } from "@/components/advertisement/BasicInformation";
import { ContactLocation } from "@/components/advertisement/ContactLocation";
import { CustomRates } from "@/components/advertisement/CustomRates";
import { ServicesSelection } from "@/components/advertisement/ServicesSelection";
import { StyleSelection } from "@/components/advertisement/StyleSelection";
import { Description } from "@/components/advertisement/Description";
import { MediaUpload } from "@/components/advertisement/MediaUpload";
import { FormActions } from "@/components/advertisement/FormActions";
import { formSchema } from "@/components/advertisement/advertisementSchema";
import { useAdvertisement } from "@/hooks/useAdvertisement";
import { StyleType, FormValues } from "@/types/advertisement";

const CriarAnuncio = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: advertisement, isLoading: isLoadingAd } = useAdvertisement(id);
  
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

  useEffect(() => {
    if (advertisement) {
      const customRates = advertisement.custom_rate_description
        ? JSON.parse(advertisement.custom_rate_description)
        : [];

      const style = advertisement.style;
      if (!isValidStyle(style)) {
        console.error("Invalid style value:", style);
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
        services: advertisement.advertisement_services.map((s) => s.service),
        description: advertisement.description,
      });
    }
  }, [advertisement, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Você precisa estar logado para criar um anúncio");
        navigate("/login");
        return;
      }

      let profilePhotoUrl = null;
      if (profilePhoto) {
        const { data: profilePhotoData, error: profilePhotoError } =
          await supabase.storage
            .from("profile_photos")
            .upload(`${user.id}/${Date.now()}`, profilePhoto);

        if (profilePhotoError) throw profilePhotoError;
        profilePhotoUrl = profilePhotoData.path;
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

      const { data: ad, error: adError } = id
        ? await supabase
            .from("advertisements")
            .update(adData)
            .eq("id", id)
            .select()
            .single()
        : await supabase
            .from("advertisements")
            .insert(adData)
            .select()
            .single();

      if (adError) throw adError;

      if (id) {
        await supabase
          .from("advertisement_services")
          .delete()
          .eq("advertisement_id", id);
      }

      const { error: servicesError } = await supabase
        .from("advertisement_services")
        .insert(
          values.services.map((service) => ({
            advertisement_id: ad.id,
            service,
          }))
        );

      if (servicesError) throw servicesError;

      if (photos.length > 0) {
        if (id) {
          await supabase
            .from("advertisement_photos")
            .delete()
            .eq("advertisement_id", id);
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

        const { error: photosError } = await supabase
          .from("advertisement_photos")
          .insert(
            photoUrls.map((url) => ({
              advertisement_id: ad.id,
              photo_url: url,
            }))
          );

        if (photosError) throw photosError;
      }

      if (videos.length > 0) {
        if (id) {
          await supabase
            .from("advertisement_videos")
            .delete()
            .eq("advertisement_id", id);
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

        const { error: videosError } = await supabase
          .from("advertisement_videos")
          .insert(
            videoUrls.map((url) => ({
              advertisement_id: ad.id,
              video_url: url,
            }))
          );

        if (videosError) throw videosError;
      }

      toast.success(id ? "Anúncio atualizado com sucesso!" : "Anúncio criado com sucesso!");
      navigate("/anuncios");
    } catch (error) {
      console.error("Error creating/updating advertisement:", error);
      toast.error(id ? "Erro ao atualizar anúncio" : "Erro ao criar anúncio");
    } finally {
      setIsLoading(false);
    }
  };

  if (id && isLoadingAd) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          {id ? "Editar Anúncio" : "Criar Anúncio"}
        </h1>
        <p className="text-muted-foreground">
          {id
            ? "Atualize as informações do seu anúncio abaixo"
            : "Preencha os campos abaixo para criar seu anúncio"}
        </p>
      </div>

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
          <FormActions isLoading={isLoading} isEditing={!!id} />
        </form>
      </Form>
    </div>
  );
};

export default CriarAnuncio;