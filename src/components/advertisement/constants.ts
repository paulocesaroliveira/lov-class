import { Database } from "@/integrations/supabase/types";

type ServiceType = Database["public"]["Enums"]["service_type"];

export const services: { id: ServiceType; label: string }[] = [
  { id: "acessorios_eroticos", label: "Acessórios Eróticos" },
  { id: "anal", label: "Anal" },
  { id: "beijo_grego", label: "Beijo Grego" },
  { id: "beijo_na_boca", label: "Beijo na Boca" },
  { id: "bondage", label: "Bondage" },
  { id: "chuva_dourada", label: "Chuva Dourada" },
  { id: "chuva_marrom", label: "Chuva Marrom" },
  { id: "dominacao", label: "Dominação" },
  { id: "dupla_penetracao", label: "Dupla Penetração" },
  { id: "fetiche_pe", label: "Fetiche Pé" },
  { id: "gangbang", label: "Gangbang" },
  { id: "massagem", label: "Massagem" },
  { id: "menage_casal", label: "Menage Casal" },
  { id: "oral_sem", label: "Oral Sem" },
  { id: "permite_filmagem", label: "Permite Filmagem" },
  { id: "striptease", label: "Striptease" },
  { id: "vaginal", label: "Vaginal" },
  { id: "voyeurismo", label: "Voyeurismo" },
] as const;

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