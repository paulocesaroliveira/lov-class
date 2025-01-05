import { z } from "zod";
import { ServiceType, ServiceLocationType } from "@/integrations/supabase/types/enums";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  height: z.number().min(140, "Altura mínima é 140cm").max(220, "Altura máxima é 220cm"),
  weight: z.number().min(40, "Peso mínimo é 40kg").max(150, "Peso máximo é 150kg"),
  category: z.enum(["mulher", "trans", "homem"]),
  ethnicity: z.string(),
  hairColor: z.string(),
  bodyType: z.string(),
  silicone: z.string(),
  whatsapp: z.string().min(10, "WhatsApp inválido"),
  state: z.string().length(2, "Estado deve ter 2 letras"),
  city: z.string().min(2, "Cidade é obrigatória"),
  neighborhood: z.string().min(2, "Bairro é obrigatório"),
  hourlyRate: z.number().min(50, "Valor mínimo é R$ 50"),
  customRates: z.array(
    z.object({
      description: z.string(),
      value: z.number(),
    })
  ),
  style: z.string(),
  services: z.array(z.custom<ServiceType>()),
  serviceLocations: z.array(z.custom<ServiceLocationType>()),
  description: z.string().min(20, "Descrição deve ter pelo menos 20 caracteres"),
  identityDocument: z.any(),
});