import { useState } from "react";
import { Profile } from "../types";

export const useUserSort = (filteredUsers: Profile[] | undefined) => {
  const [sortColumn, setSortColumn] = useState<keyof Profile | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: keyof Profile) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedUsers = filteredUsers?.sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });

  return {
    sortColumn,
    sortDirection,
    handleSort,
    sortedUsers,
  };
};