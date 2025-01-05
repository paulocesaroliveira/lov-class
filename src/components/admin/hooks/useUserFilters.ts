import { useState } from "react";
import { UserRole } from "../types";

export const useUserFilters = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "all">("all");
  const [selectedDate, setSelectedDate] = useState<string>("");

  return {
    searchTerm,
    setSearchTerm,
    selectedRole,
    setSelectedRole,
    selectedDate,
    setSelectedDate,
  };
};