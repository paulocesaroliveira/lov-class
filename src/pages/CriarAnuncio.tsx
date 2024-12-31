import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { BasicInformation } from "@/components/advertisement/BasicInformation";
import { ContactLocation } from "@/components/advertisement/ContactLocation";
import { CustomRates } from "@/components/advertisement/CustomRates";
import { ServicesSelection } from "@/components/advertisement/ServicesSelection";
import { Description } from "@/components/advertisement/Description";
import { MediaUpload } from "@/components/advertisement/MediaUpload";
import { formSchema } from "@/components/advertisement/advertisementSchema";
import { Database } from "@/integrations/supabase/types";

type ServiceType = Database["public"]["Enums"]["service_type"];

const CriarAnuncio = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      services: [],
      customRates: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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

      const { data: ad, error: adError } = await supabase
        .from("advertisements")
        .insert({
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
          description: values.description,
          profile_photo_url: profilePhotoUrl,
        })
        .select()
        .single();

      if (adError) throw adError;

      const { error: servicesError } = await supabase
        .from("advertisement_services")
        .insert(
          values.services.map((service) => ({
            advertisement_id: ad.id,
            service: service as ServiceType,
          }))
        );

      if (servicesError) throw servicesError;

      if (photos.length > 0) {
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

      toast.success("Anúncio criado com sucesso!");
      navigate("/anuncios");
    } catch (error) {
      console.error("Error creating advertisement:", error);
      toast.error("Erro ao criar anúncio. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Criar Anúncio</h1>
        <p className="text-muted-foreground">
          Preencha os campos abaixo para criar seu anúncio
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <BasicInformation form={form} />
          <ContactLocation form={form} />
          <CustomRates form={form} />
          <ServicesSelection form={form} />
          <Description form={form} />
          <MediaUpload
            setProfilePhoto={setProfilePhoto}
            setPhotos={setPhotos}
            setVideos={setVideos}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando anúncio...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Criar Anúncio
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CriarAnuncio;