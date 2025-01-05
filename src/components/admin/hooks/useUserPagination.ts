import { useState } from "react";
import { Profile } from "../types";

export const useUserPagination = (sortedUsers: Profile[] | undefined) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const paginatedUsers = sortedUsers?.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = sortedUsers ? Math.ceil(sortedUsers.length / itemsPerPage) : 0;

  return {
    page,
    setPage,
    paginatedUsers,
    totalPages,
  };
};