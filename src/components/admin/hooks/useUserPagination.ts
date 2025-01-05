import { useState } from "react";

export const useUserPagination = () => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  return {
    page,
    setPage,
    itemsPerPage,
  };
};