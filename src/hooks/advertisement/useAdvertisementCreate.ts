import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "@/types/advertisement";
import { prepareAdvertisementData } from "./utils";

export const useAdvertisementCreate = () => {
  const createAdvertisement = async (
    values: FormValues,
    userId: string,
    profilePhotoUrl: string | null
  ) => {
    const { data: existingAd, error: existingAdError } = await supabase
      .from("advertisements")
      .select()
      .eq("profile_id", userId)
      .limit(1)
      .maybeSingle();

    if (existingAdError) {
      console.error("Erro ao verificar anúncio existente:", existingAdError);
      throw existingAdError;
    }

    if (existingAd) {
      throw new Error("Você já possui um anúncio cadastrado");
    }

    const adData = prepareAdvertisementData(values, userId, profilePhotoUrl);

    const { data: ad, error: adError } = await supabase
      .from("advertisements")
      .insert(adData)
      .select()
      .limit(1)
      .maybeSingle();

    if (adError) {
      console.error("Erro ao criar anúncio:", adError);
      throw adError;
    }

    if (!ad) {
      throw new Error("Erro ao criar anúncio");
    }

    return ad;
  };

  return { createAdvertisement };
};