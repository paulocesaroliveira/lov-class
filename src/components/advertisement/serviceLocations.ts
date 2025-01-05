import { ServiceLocationType } from "@/integrations/supabase/types/enums";

export const serviceLocations: { id: ServiceLocationType; label: string }[] = [
  { id: "clube_swing", label: "Clube Swing" },
  { id: "com_local", label: "Com Local" },
  { id: "domicilio", label: "Domicílio" },
  { id: "motel", label: "Motel" },
  { id: "viagens", label: "Viagens" },
] as const;