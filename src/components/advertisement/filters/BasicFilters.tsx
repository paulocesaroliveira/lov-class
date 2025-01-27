import { useEffect } from "react";
import { Filters } from "@/types/advertisement";

export interface BasicFiltersProps {
  filters: Filters;
  onFilterChange: (newFilters: Partial<Filters>) => void;
}

export const BasicFilters = ({ filters, onFilterChange }: BasicFiltersProps) => {
  const handleFilterChange = (field: keyof Filters, value: any) => {
    onFilterChange({ [field]: value });
  };

  return (
    <div>
      <div>
        <label>Min Age</label>
        <input
          type="number"
          value={filters.minAge || ""}
          onChange={(e) => handleFilterChange("minAge", Number(e.target.value))}
        />
      </div>
      <div>
        <label>Max Age</label>
        <input
          type="number"
          value={filters.maxAge || ""}
          onChange={(e) => handleFilterChange("maxAge", Number(e.target.value))}
        />
      </div>
      <div>
        <label>Min Price</label>
        <input
          type="number"
          value={filters.minPrice || ""}
          onChange={(e) => handleFilterChange("minPrice", Number(e.target.value))}
        />
      </div>
      <div>
        <label>Max Price</label>
        <input
          type="number"
          value={filters.maxPrice || ""}
          onChange={(e) => handleFilterChange("maxPrice", Number(e.target.value))}
        />
      </div>
      <div>
        <label>Services</label>
        <input
          type="text"
          value={filters.services?.join(", ") || ""}
          onChange={(e) => handleFilterChange("services", e.target.value.split(", "))}
        />
      </div>
      <div>
        <label>Service Locations</label>
        <input
          type="text"
          value={filters.serviceLocations?.join(", ") || ""}
          onChange={(e) => handleFilterChange("serviceLocations", e.target.value.split(", "))}
        />
      </div>
      <div>
        <label>Style</label>
        <input
          type="text"
          value={filters.style || ""}
          onChange={(e) => handleFilterChange("style", e.target.value)}
        />
      </div>
      <div>
        <label>Category</label>
        <input
          type="text"
          value={filters.category || ""}
          onChange={(e) => handleFilterChange("category", e.target.value)}
        />
      </div>
    </div>
  );
};