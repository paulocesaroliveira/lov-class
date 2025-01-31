import { FormValues } from "@/types/advertisement";

export const prepareAdvertisementData = (values: FormValues, userId: string, profilePhotoUrl: string | null) => {
  return {
    profile_id: userId,
    name: values.name,
    description: values.description,
    birth_date: values.birth_date,
    height: values.height,
    weight: values.weight,
    ethnicity: values.ethnicity,
    hair_color: values.hair_color,
    body_type: values.body_type,
    silicone: values.silicone,
    contact_phone: values.contact_phone,
    contact_whatsapp: values.contact_whatsapp,
    contact_telegram: values.contact_telegram,
    hourly_rate: values.hourly_rate,
    custom_rate_description: values.custom_rates?.[0]?.description || null,
    custom_rate_value: values.custom_rates?.[0]?.value || null,
    style: values.style,
    city: values.city,
    neighborhood: values.neighborhood,
    category: values.category,
    profile_photo_url: profilePhotoUrl,
  };
};