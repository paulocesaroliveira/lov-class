import { z } from "zod";
import { ServiceType, ServiceLocationType } from "@/integrations/supabase/types/enums";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const formSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório e deve ter pelo menos 2 caracteres"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  height: z.number().min(140, "Altura mínima é 140cm").max(220, "Altura máxima é 220cm"),
  weight: z.number().min(40, "Peso mínimo é 40kg").max(150, "Peso máximo é 150kg"),
  category: z.enum(["mulher", "trans", "homem"], {
    required_error: "Categoria é obrigatória",
  }),
  ethnicity: z.string().min(1, "Etnia é obrigatória"),
  hairColor: z.string().min(1, "Cor do cabelo é obrigatória"),
  bodyType: z.string().min(1, "Tipo de corpo é obrigatório"),
  silicone: z.string().min(1, "Campo silicone é obrigatório"),
  contact_phone: z.string().min(14, "Telefone é obrigatório e deve ser válido"),
  contact_whatsapp: z.boolean(),
  contact_telegram: z.boolean(),
  state: z.string().length(2, "Estado deve ter 2 letras"),
  city: z.string().min(2, "Cidade é obrigatória"),
  neighborhood: z.string().min(2, "Bairro é obrigatório"),
  hourlyRate: z.number().min(50, "Valor mínimo é R$ 50"),
  customRates: z.array(
    z.object({
      description: z.string().min(1, "Descrição é obrigatória"),
      value: z.number().min(1, "Valor é obrigatório"),
    })
  ),
  style: z.string().min(1, "Estilo é obrigatório"),
  services: z.array(z.custom<ServiceType>()).min(1, "Selecione pelo menos um serviço"),
  serviceLocations: z.array(z.custom<ServiceLocationType>()).min(1, "Selecione pelo menos um local de atendimento"),
  description: z.string().min(20, "Descrição deve ter pelo menos 20 caracteres"),
  identityDocument: z.any(),
});