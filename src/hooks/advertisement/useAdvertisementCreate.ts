import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "@/types/advertisement";
import { prepareAdvertisementData } from "./utils";

export const useAdvertisementCreate = () => {
  const createAdvertisement = async (
    values: FormValues,
    userId: string,
    profilePhotoUrl: string | null
  ) => {
    console.log("Checking for existing advertisement...");
    
    const { data: existingAd, error: existingAdError } = await supabase
      .from("advertisements")
      .select()
      .eq("profile_id", userId)
      .maybeSingle();

    if (existingAdError) {
      console.error("Erro ao verificar anúncio existente:", existingAdError);
      throw existingAdError;
    }

    if (existingAd) {
      throw new Error("Você já possui um anúncio cadastrado");
    }

    console.log("Creating new advertisement...");
    const adData = prepareAdvertisementData(values, userId, profilePhotoUrl);

    const { data, error } = await supabase
      .from("advertisements")
      .insert(adData)
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar anúncio:", error);
      throw error;
    }

    if (!data) {
      throw new Error("Erro ao criar anúncio");
    }

    console.log("Advertisement created successfully:", data);
    return data;
  };

  return { createAdvertisement };
};