import { FormValues } from "@/types/advertisement";

export const prepareAdvertisementData = (values: FormValues, userId: string, profilePhotoUrl: string | null) => {
  return {
    profile_id: userId,
    name: values.name,
    description: values.description,
    birth_date: values.birthDate,
    height: values.height,
    weight: values.weight,
    ethnicity: values.ethnicity,
    hair_color: values.hairColor,
    body_type: values.bodyType,
    silicone: values.silicone,
    contact_phone: values.contact_phone,
    contact_whatsapp: values.contact_whatsapp,
    contact_telegram: values.contact_telegram,
    hourly_rate: values.hourlyRate,
    custom_rate_description: values.customRateDescription,
    custom_rate_value: values.customRateValue,
    style: values.style,
    city: values.city,
    neighborhood: values.neighborhood,
    category: values.category,
    profile_photo_url: profilePhotoUrl,
  };
};