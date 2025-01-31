export interface FormValues {
  id?: string;
  name: string; // Make name required
  birth_date: string;
  body_type: string;
  category: "mulher" | "trans" | "homem";
  city: string;
  contact_phone: string;
  contact_telegram?: boolean;
  contact_whatsapp?: boolean;
  description: string;
  ethnicity: string;
  hair_color: string;
  height: number;
  hourly_rate: number;
  custom_rate_description?: string;
  custom_rate_value?: number;
  neighborhood: string;
  photos?: File[];
  profile_photo?: File;
  silicone: string;
  state: string;
  style: string;
  videos?: File[];
  weight: number;
  acceptTerms: boolean;
}