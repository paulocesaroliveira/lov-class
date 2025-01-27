import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebounce } from "@/hooks/useDebounce";

export interface BasicFiltersProps {
  onSearchChange: (value: string) => void;
  initialSearch?: string;
}

export const BasicFilters = ({ onSearchChange, initialSearch = "" }: BasicFiltersProps) => {
  const [search, setSearch] = useState(initialSearch);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="search">Buscar</Label>
        <Input
          id="search"
          placeholder="Digite para buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>
  );
};