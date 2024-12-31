import { z } from "zod";
import { Database } from "@/integrations/supabase/types";

type ServiceType = Database["public"]["Enums"]["service_type"];

export const customRateSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  value: z.number().min(0, "Valor deve ser maior que zero"),
});

export const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  birthDate: z.string().refine((date) => {
    const birthDate = new Date(date);
    const age = Math.floor(
      (Date.now() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    );
    return age >= 18;
  }, "Você deve ter pelo menos 18 anos"),
  height: z
    .number()
    .min(100, "Altura mínima é 100cm")
    .max(250, "Altura máxima é 250cm"),
  weight: z
    .number()
    .min(30, "Peso mínimo é 30kg")
    .max(300, "Peso máximo é 300kg"),
  category: z.enum(["mulher", "trans", "homem"]),
  whatsapp: z.string().min(10, "WhatsApp inválido"),
  state: z.string().min(2, "Estado é obrigatório"),
  city: z.string().min(2, "Cidade é obrigatória"),
  neighborhood: z.string().min(2, "Bairro é obrigatório"),
  hourlyRate: z.number().min(0, "Valor deve ser maior que zero"),
  customRates: z.array(customRateSchema).max(5, "Máximo de 5 valores personalizados"),
  services: z.array(z.enum([
    "beijo_na_boca",
    "beijo_grego",
    "bondage",
    "chuva_dourada",
    "chuva_marrom",
    "dominacao",
    "acessorios_eroticos",
    "voyeurismo",
    "permite_filmagem",
    "menage_casal",
    "menage_dois_homens",
    "roleplay",
    "facefuck",
    "oral_sem_preservativo",
    "oral_com_preservativo",
    "massagem",
    "sexo_virtual",
    "orgia",
    "gangbang"
  ] as const)).min(1, "Selecione pelo menos um serviço"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
});