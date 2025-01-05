import { FormValues } from "@/types/advertisement";

export const prepareAdvertisementData = (
  values: FormValues,
  userId: string,
  profilePhotoUrl: string | null
) => {
  return {
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
    custom_rate_description: values.customRates.length > 0
      ? JSON.stringify(values.customRates)
      : null,
    style: values.style,
    description: values.description,
    ...(profilePhotoUrl && { profile_photo_url: profilePhotoUrl }),
  };
};