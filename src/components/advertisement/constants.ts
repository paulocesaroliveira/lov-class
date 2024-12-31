import { Database } from "@/integrations/supabase/types";

type ServiceType = Database["public"]["Enums"]["service_type"];

export const services: { id: ServiceType; label: string }[] = [
  { id: "beijo_na_boca", label: "Beijo na Boca" },
  { id: "beijo_grego", label: "Beijo Grego" },
  { id: "bondage", label: "Bondage" },
  { id: "chuva_dourada", label: "Chuva Dourada" },
  { id: "chuva_marrom", label: "Chuva Marrom" },
  { id: "dominacao", label: "Dominação" },
  { id: "acessorios_eroticos", label: "Acessórios Eróticos" },
  { id: "voyeurismo", label: "Voyeurismo" },
  { id: "permite_filmagem", label: "Permite Filmagem" },
  { id: "menage_casal", label: "Ménage (Casal)" },
  { id: "menage_dois_homens", label: "Ménage (c/ 2 Homens)" },
  { id: "roleplay", label: "Roleplay" },
  { id: "facefuck", label: "Facefuck" },
  { id: "oral_sem_preservativo", label: "Oral Sem Preservativo" },
  { id: "oral_com_preservativo", label: "Oral Com Preservativo" },
  { id: "massagem", label: "Massagem" },
  { id: "sexo_virtual", label: "Sexo Virtual" },
  { id: "orgia", label: "Orgia" },
  { id: "gangbang", label: "Gangbang" },
];

export const styles = [
  { value: "patricinha", label: "Patricinha" },
  { value: "nerd", label: "Nerd" },
  { value: "passista", label: "Passista" },
  { value: "milf", label: "MILF" },
  { value: "fitness", label: "Fitness" },
  { value: "ninfeta", label: "Ninfeta" },
  { value: "gordelicia", label: "Gordelícia" },
];