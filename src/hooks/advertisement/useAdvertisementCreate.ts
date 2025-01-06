import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "@/types/advertisement";
import { toast } from "sonner";

export const useAdvertisementCreate = () => {
  const createAdvertisement = async (
    values: FormValues,
    userId: string,
    profilePhotoUrl: string | null
  ) => {
    try {
      console.log("Creating new advertisement...");

      // First create the advertisement
      const { data: advertisement, error: adError } = await supabase
        .from("advertisements")
        .insert({
          profile_id: userId,
          name: values.name,
          birth_date: values.birthDate,
          height: values.height,
          weight: values.weight,
          category: values.category,
          ethnicity: values.ethnicity,
          hair_color: values.hairColor,
          body_type: values.bodyType,
          silicone: values.silicone,
          contact_phone: values.contact_phone,
          contact_whatsapp: values.contact_whatsapp,
          contact_telegram: values.contact_telegram,
          state: values.state,
          city: values.city,
          neighborhood: values.neighborhood,
          hourly_rate: values.hourlyRate,
          custom_rate_description: values.customRates?.[0]?.description || null,
          custom_rate_value: values.customRates?.[0]?.value || null,
          description: values.description,
          profile_photo_url: profilePhotoUrl,
          style: values.style,
          status: 'new'
        })
        .select()
        .single();

      if (adError) {
        console.error("Error creating advertisement:", adError);
        throw adError;
      }

      // Now that we have the advertisement, we can create the review
      const { error: reviewError } = await supabase
        .from("advertisement_reviews")
        .insert({
          advertisement_id: advertisement.id,
          status: 'pending',
          review_notes: 'Novo anúncio aguardando revisão'
        });

      if (reviewError) {
        console.error("Error creating review:", reviewError);
        throw reviewError;
      }

      return advertisement;
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao criar anúncio");
      throw error;
    }
  };

  return { createAdvertisement };
};