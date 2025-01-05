import { z } from "zod";

// Define the enum values directly in the schema
const categoryEnum = z.enum(["mulher", "trans", "homem"]);

const serviceTypeEnum = z.enum([
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
]);

const serviceLocationTypeEnum = z.enum([
  "com_local",
  "motel",
  "clube_swing",
  "domicilio",
  "viagens"
]);

export const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  height: z.number().min(0, "Altura deve ser um número positivo"),
  weight: z.number().min(0, "Peso deve ser um número positivo"),
  category: categoryEnum,
  ethnicity: z.string().min(1, "Etnia é obrigatória"),
  hairColor: z.string().min(1, "Cor do cabelo é obrigatória"),
  bodyType: z.string().min(1, "Tipo de corpo é obrigatório"),
  silicone: z.string().min(1, "Informação sobre silicone é obrigatória"),
  contact_phone: z.string().min(1, "Telefone de contato é obrigatório"),
  contact_whatsapp: z.boolean(),
  contact_telegram: z.boolean(),
  state: z.string().min(1, "Estado é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  hourlyRate: z.number().min(0, "Valor da hora deve ser um número positivo"),
  customRates: z.array(z.object({
    description: z.string().min(1, "Descrição é obrigatória"),
    value: z.number().min(0, "Valor deve ser um número positivo"),
  })).max(5, "Máximo de 5 valores personalizados"),
  style: z.string().min(1, "Estilo é obrigatório"),
  services: z.array(serviceTypeEnum),
  serviceLocations: z.array(serviceLocationTypeEnum),
  description: z.string().min(1, "Descrição do atendimento é obrigatória"),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Você precisa aceitar os termos e condições para continuar",
  }),
  identityDocument: z.any().optional(),
  profilePhoto: z.any().optional(),
  photos: z.array(z.any()).optional(),
  videos: z.array(z.any()).optional(),
});