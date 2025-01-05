import { useState } from "react";
import { UserRole, Profile } from "../types";
import { format } from "date-fns";

export const useUserFilters = (users: Profile[] | undefined) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "all">("all");
  const [selectedDate, setSelectedDate] = useState<string>("");

  const filteredUsers = users?.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesDate = !selectedDate || format(new Date(user.created_at), "yyyy-MM-dd") === selectedDate;
    return matchesSearch && matchesRole && matchesDate;
  });

  return {
    searchTerm,
    setSearchTerm,
    selectedRole,
    setSelectedRole,
    selectedDate,
    setSelectedDate,
    filteredUsers,
  };
};