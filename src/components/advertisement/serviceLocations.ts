export const serviceLocations = [
  {
    id: "com_local",
    label: "Com Local",
  },
  {
    id: "motel",
    label: "Motel",
  },
  {
    id: "clube_swing",
    label: "Clube de Swing",
  },
  {
    id: "domicilio",
    label: "Domicílio",
  },
  {
    id: "viagens",
    label: "Viagens",
  },
] as const;

export type ServiceLocationType = typeof serviceLocations[number]["id"];