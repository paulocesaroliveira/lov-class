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

      const profilePhotoUrl = await uploadProfilePhoto();
      console.log("Foto de perfil enviada:", profilePhotoUrl);
      
      if (advertisement?.id) {
        await deleteExistingMedia(advertisement.id);
      }

      const formValues = advertisement?.id ? { ...values, id: advertisement.id } : values;
      console.log("Salvando anúncio com valores:", formValues);
      
      // First save the advertisement to get the ID
      const ad = await saveAdvertisement(formValues, user.id, profilePhotoUrl, !!advertisement);
      console.log("Anúncio salvo com sucesso:", ad);

      // Then upload the identity document using the advertisement ID
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

        const { error: docRefError } = await supabase
          .from("advertiser_documents")
          .insert({
            advertisement_id: ad.id,
            document_url: documentFileName,
          });

        if (docRefError) {
          console.error("Erro ao salvar referência do documento:", docRefError);
          toast.error("Erro ao salvar referência do documento");
          return;
        }
      }
      
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

      if (!advertisement) {
        setShowModerationAlert(true);
      } else {
        toast.success("Anúncio atualizado com sucesso!");
        navigate("/anuncios");
      }
    } catch (error: any) {
      console.error("Erro detalhado ao " + (advertisement ? "atualizar" : "criar") + " anúncio:", error);
      toast.error(`Erro ao ${advertisement ? 'atualizar' : 'criar'} anúncio: ${error.message || 'Erro desconhecido'}`);
      throw error;
    }
  };

  return { handleSubmit };
};