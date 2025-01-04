import { Database } from "@/integrations/supabase/types";

type ServiceLocationType = Database["public"]["Enums"]["service_location_type"];

export const serviceLocations: { id: ServiceLocationType; label: string }[] = [
  { id: "clube_swing", label: "Clube Swing" },
  { id: "com_local", label: "Com Local" },
  { id: "domicilio", label: "Domicílio" },
  { id: "motel", label: "Motel" },
  { id: "viagens", label: "Viagens" },
] as const;