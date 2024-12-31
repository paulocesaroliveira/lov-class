import { FormValues } from "@/types/advertisement";
import { useAdvertisementCreate } from "./advertisement/useAdvertisementCreate";
import { useAdvertisementUpdate } from "./advertisement/useAdvertisementUpdate";
import { useAdvertisementMedia } from "./advertisement/useAdvertisementMedia";
import { useAdvertisementServices } from "./advertisement/useAdvertisementServices";

export const useAdvertisementOperations = () => {
  const { createAdvertisement } = useAdvertisementCreate();
  const { updateAdvertisement } = useAdvertisementUpdate();
  const { savePhotos, saveVideos, deleteExistingMedia } = useAdvertisementMedia();
  const { saveServices, saveServiceLocations } = useAdvertisementServices();

  const saveAdvertisement = async (
    values: FormValues,
    userId: string,
    profilePhotoUrl: string | null,
    isEditing: boolean
  ) => {
    console.log("Salvando dados do anúncio:", values);
    console.log("isEditing:", isEditing);
    console.log("advertisementId:", values.id);

    if (isEditing) {
      return await updateAdvertisement(values, userId, profilePhotoUrl);
    } else {
      return await createAdvertisement(values, userId, profilePhotoUrl);
    }
  };

  return {
    saveAdvertisement,
    saveServices,
    saveServiceLocations,
    savePhotos,
    saveVideos,
    deleteExistingMedia,
  };
};