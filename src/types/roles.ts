export type UserRole = "user" | "advertiser" | "admin";

export const getRoleLabel = (role: UserRole): string => {
  switch (role) {
    case "user":
      return "Cliente";
    case "advertiser":
      return "Anunciante";
    case "admin":
      return "Admin";
    default:
      return role;
  }
};