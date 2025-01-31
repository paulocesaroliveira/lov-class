import { z } from "zod";
import { ServiceType, ServiceLocationType } from "@/integrations/supabase/types/database/enums";

export const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nome é obrigatório"),
  birth_date: z.string().min(1, "Data de nascimento é obrigatória"),
  height: z.number().min(0, "Altura deve ser um número positivo"),
  weight: z.number().min(0, "Peso deve ser um número positivo"),
  category: z.enum(["mulher", "trans", "homem"] as const),
  ethnicity: z.string().min(1, "Etnia é obrigatória"),
  hair_color: z.string().min(1, "Cor do cabelo é obrigatória"),
  body_type: z.string().min(1, "Tipo de corpo é obrigatório"),
  silicone: z.string().min(1, "Informação sobre silicone é obrigatória"),
  contact_phone: z.string().min(1, "Telefone de contato é obrigatório"),
  contact_whatsapp: z.boolean(),
  contact_telegram: z.boolean(),
  state: z.string().min(1, "Estado é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  hourly_rate: z.number().min(0, "Valor da hora deve ser um número positivo"),
  custom_rates: z.array(z.object({
    description: z.string().min(1, "Descrição é obrigatória"),
    value: z.number().min(0, "Valor deve ser um número positivo"),
  })).max(5, "Máximo de 5 valores personalizados"),
  style: z.string().min(1, "Estilo é obrigatório"),
  services: z.array(z.string() as z.ZodType<ServiceType>),
  serviceLocations: z.array(z.string() as z.ZodType<ServiceLocationType>),
  description: z.string().min(1, "Descrição do atendimento é obrigatória"),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Você precisa aceitar os termos e condições para continuar",
  }),
  profile_photo: z.any().optional(),
  photos: z.array(z.any()).optional(),
  videos: z.array(z.any()).optional(),
  identityDocument: z.any().optional(),
});

export type FormData = z.infer<typeof formSchema>;