export const serviceLocations = [
  { id: "com_local", label: "Com Local" },
  { id: "motel", label: "Motel" },
  { id: "clube_swing", label: "Clube de Swing" },
  { id: "domicilio", label: "Residência" },
  { id: "viagens", label: "Viagens" },
] as const;

// Add type to ensure IDs match the database enum
export type ServiceLocationType = typeof serviceLocations[number]["id"];