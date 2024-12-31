import { z } from "zod";
import { Database } from "@/integrations/supabase/types";

type ServiceType = Database["public"]["Enums"]["service_type"];
type ServiceLocationType = Database["public"]["Enums"]["service_location_type"];

export const customRateSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  value: z.number().min(0, "Valor deve ser maior que zero"),
});

export const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Nome é obrigatório e deve ter pelo menos 2 caracteres"),
  birthDate: z.string().refine((date) => {
    if (!date) return false;
    const birthDate = new Date(date);
    const age = Math.floor(
      (Date.now() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    );
    return age >= 18;
  }, "Data de nascimento é obrigatória e você deve ter pelo menos 18 anos"),
  height: z
    .number()
    .min(100, "Altura mínima é 100cm")
    .max(250, "Altura máxima é 250cm"),
  weight: z
    .number()
    .min(30, "Peso mínimo é 30kg")
    .max(300, "Peso máximo é 300kg"),
  category: z.enum(["mulher", "trans", "homem"], {
    required_error: "Categoria é obrigatória",
  }),
  ethnicity: z.enum(["branca", "negra", "oriental"], {
    required_error: "Etnia é obrigatória",
  }),
  hairColor: z.enum(["morena", "loira", "ruiva", "colorido"], {
    required_error: "Cor do cabelo é obrigatória",
  }),
  bodyType: z.enum(["magra", "gordinha"], {
    required_error: "Tipo de corpo é obrigatório",
  }),
  silicone: z.enum(["nao_uso", "seios", "bumbum", "seios_e_bumbum"], {
    required_error: "Informação sobre silicone é obrigatória",
  }),
  whatsapp: z.string().min(10, "WhatsApp é obrigatório e deve ser válido"),
  state: z.string().min(2, "Estado é obrigatório"),
  city: z.string().min(2, "Cidade é obrigatória"),
  neighborhood: z.string().min(2, "Bairro é obrigatório"),
  hourlyRate: z.number().min(1, "Valor da hora é obrigatório e deve ser maior que zero"),
  customRates: z.array(customRateSchema),
  style: z.enum(["patricinha", "nerd", "passista", "milf", "fitness", "ninfeta", "gordelicia"], {
    required_error: "Estilo é obrigatório",
  }),
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
  serviceLocations: z.array(z.enum([
    "com_local",
    "motel",
    "clube_swing",
    "domicilio",
    "viagens"
  ] as const)).min(1, "Selecione pelo menos um local de atendimento"),
  description: z.string().min(10, "Descrição é obrigatória e deve ter pelo menos 10 caracteres"),
});