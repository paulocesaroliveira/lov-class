import { Database } from "@/integrations/supabase/types";

type ServiceType = Database["public"]["Enums"]["service_type"];

export const services: { id: ServiceType; label: string }[] = [
  { id: "acessorios_eroticos", label: "Acessórios Eróticos" },
  { id: "beijo_grego", label: "Beijo Grego" },
  { id: "beijo_na_boca", label: "Beijo na Boca" },
  { id: "bondage", label: "Bondage" },
  { id: "chuva_dourada", label: "Chuva Dourada" },
  { id: "chuva_marrom", label: "Chuva Marrom" },
  { id: "dominacao", label: "Dominação" },
  { id: "gangbang", label: "Gangbang" },
  { id: "massagem", label: "Massagem" },
  { id: "menage_casal", label: "Menage Casal" },
  { id: "menage_dois_homens", label: "Menage Dois Homens" },
  { id: "oral_com_preservativo", label: "Oral Com Preservativo" },
  { id: "oral_sem_preservativo", label: "Oral Sem Preservativo" },
  { id: "orgia", label: "Orgia" },
  { id: "permite_filmagem", label: "Permite Filmagem" },
  { id: "roleplay", label: "Roleplay" },
  { id: "sexo_virtual", label: "Sexo Virtual" },
  { id: "voyeurismo", label: "Voyeurismo" },
];

export const styles = [
  { value: "fitness", label: "Fitness" },
  { value: "gordelicia", label: "Gordelicia" },
  { value: "milf", label: "Milf" },
  { value: "nerd", label: "Nerd" },
  { value: "ninfeta", label: "Ninfeta" },
  { value: "passista", label: "Passista" },
  { value: "patricinha", label: "Patricinha" },
] as const;

export type StyleType = typeof styles[number]["value"];