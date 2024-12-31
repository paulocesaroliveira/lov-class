import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "@/types/advertisement";
import { prepareAdvertisementData } from "./utils";

export const useAdvertisementUpdate = () => {
  const updateAdvertisement = async (
    values: FormValues,
    userId: string,
    profilePhotoUrl: string | null
  ) => {
    if (!values.id) {
      throw new Error("ID do anúncio não fornecido para atualização");
    }

    const adData = prepareAdvertisementData(values, userId, profilePhotoUrl);

    const { data: ad, error: adError } = await supabase
      .from("advertisements")
      .update(adData)
      .eq("id", values.id)
      .eq("profile_id", userId)
      .select()
      .limit(1)
      .maybeSingle();

    if (adError) {
      console.error("Erro ao atualizar anúncio:", adError);
      throw adError;
    }

    if (!ad) {
      throw new Error("Anúncio não encontrado ou você não tem permissão para editá-lo");
    }

    return ad;
  };

  return { updateAdvertisement };
};