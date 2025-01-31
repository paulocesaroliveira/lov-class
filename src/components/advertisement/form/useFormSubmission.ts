import { FormValues } from "@/types/advertisement";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAdvertisementOperations } from "@/hooks/useAdvertisementOperations";
import { supabase } from "@/integrations/supabase/client";
import { useMediaUpload } from "@/hooks/useMediaUpload";

export const useFormSubmission = (
  user: any,
  setShowModerationAlert: (show: boolean) => void,
  identityDocument: File | null,
  advertisement?: any
) => {
  const navigate = useNavigate();
  const { 
    saveAdvertisement, 
    saveServices, 
    saveServiceLocations, 
    savePhotos, 
    saveVideos,
    deleteExistingMedia 
  } = useAdvertisementOperations();

  const {
    uploadProfilePhoto,
    uploadPhotos,
    uploadVideos,
  } = useMediaUpload(user?.id);

  const handleSubmit = async (values: FormValues) => {
    try {
      console.log("Starting form submission with values:", values);

      if (!user) {
        console.error("User not authenticated");
        toast.error("Você precisa estar logado para " + (advertisement ? "atualizar" : "criar") + " um anúncio");
        navigate("/login");
        return;
      }

      // Check if user already has an advertisement
      if (!advertisement) {
        const { data: existingAd, error: checkError } = await supabase
          .from('advertisements')
          .select('id')
          .eq('profile_id', user.id)
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          console.error("Error checking existing advertisement:", checkError);
          toast.error("Erro ao verificar anúncios existentes");
          return;
        }

        if (existingAd) {
          toast.error("Você já possui um anúncio ativo. Você pode editar seu anúncio existente.");
          navigate("/perfil");
          return;
        }
      }

      if (!identityDocument && !advertisement) {
        console.error("Identity document missing");
        toast.error("Por favor, envie uma foto do seu documento de identidade");
        return;
      }

      console.log("User authenticated:", user.id);

      // Upload profile photo first
      const profilePhotoUrl = await uploadProfilePhoto();
      console.log("Profile photo uploaded:", profilePhotoUrl);
      
      // If editing, delete existing media first
      if (advertisement?.id) {
        console.log("Deleting existing media for ad:", advertisement.id);
        await deleteExistingMedia(advertisement.id);
      }

      // Prepare form values
      const formValues = advertisement?.id 
        ? { ...values, id: advertisement.id } 
        : values;
      
      console.log("Saving advertisement with values:", formValues);
      
      // Save the main advertisement data
      const ad = await saveAdvertisement(formValues, user.id, profilePhotoUrl, !!advertisement);
      console.log("Advertisement saved successfully:", ad);

      // Upload identity document if provided
      if (identityDocument) {
        console.log("Uploading identity document");
        const documentFileName = `${user.id}/${Date.now()}-${identityDocument.name}`;
        const { error: documentError } = await supabase.storage
          .from("identity_documents")
          .upload(documentFileName, identityDocument);

        if (documentError) {
          console.error("Error uploading document:", documentError);
          toast.error("Erro ao enviar documento de identidade");
          return;
        }

        const { error: docRefError } = await supabase
          .from("advertiser_documents")
          .insert({
            advertisement_id: ad.id,
            document_url: documentFileName,
          });

        if (docRefError) {
          console.error("Error saving document reference:", docRefError);
          toast.error("Erro ao salvar referência do documento");
          return;
        }
      }
      
      // Save services
      console.log("Saving services:", values.services);
      await saveServices(ad.id, values.services);
      
      // Save service locations
      console.log("Saving service locations:", values.serviceLocations);
      await saveServiceLocations(ad.id, values.serviceLocations);

      // Upload and save photos
      const photoUrls = await uploadPhotos(ad.id);
      console.log("Photos uploaded:", photoUrls);
      
      // Upload and save videos
      const videoUrls = await uploadVideos(ad.id);
      console.log("Videos uploaded:", videoUrls);

      // Save photo and video references
      await savePhotos(ad.id, photoUrls);
      await saveVideos(ad.id, videoUrls);

      console.log("All data saved successfully");

      if (!advertisement) {
        toast.success("Anúncio criado com sucesso!");
        navigate("/anuncios");
      } else {
        toast.success("Anúncio atualizado com sucesso!");
        navigate("/anuncios");
      }
    } catch (error: any) {
      console.error("Detailed error in form submission:", error);
      toast.error(`Erro ao ${advertisement ? 'atualizar' : 'criar'} anúncio: ${error.message || 'Erro desconhecido'}`);
      throw error;
    }
  };

  return { handleSubmit };
};