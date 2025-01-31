import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Filters, ServiceLocationType } from "@/types/advertisement";

interface BasicFiltersProps {
  filters: Filters;
  handleFilterChange: (newFilters: Partial<Filters>) => void;
}

export const BasicFilters = ({ filters, handleFilterChange }: BasicFiltersProps) => {
  return (
    <div className="space-y-4">
      <div>
        <FormLabel>Service Locations</FormLabel>
        <Input
          type="text"
          value={filters.service_locations?.join(", ") || ""}
          onChange={(e) => {
            const locations = e.target.value.split(", ").filter(Boolean) as ServiceLocationType[];
            handleFilterChange({ service_locations: locations });
          }}
        />
      </div>
      <div>
        <FormLabel>Category</FormLabel>
        <Input
          type="text"
          value={filters.category || ""}
          onChange={(e) => handleFilterChange({ category: e.target.value as any })}
        />
      </div>
      <div>
        <FormLabel>City</FormLabel>
        <Input
          type="text"
          value={filters.city || ""}
          onChange={(e) => handleFilterChange({ city: e.target.value })}
        />
      </div>
      <div>
        <FormLabel>State</FormLabel>
        <Input
          type="text"
          value={filters.state || ""}
          onChange={(e) => handleFilterChange({ state: e.target.value })}
        />
      </div>
      <div>
        <FormLabel>Min Price</FormLabel>
        <Input
          type="number"
          value={filters.minPrice || ""}
          onChange={(e) => handleFilterChange({ minPrice: parseFloat(e.target.value) })}
        />
      </div>
      <div>
        <FormLabel>Max Price</FormLabel>
        <Input
          type="number"
          value={filters.maxPrice || ""}
          onChange={(e) => handleFilterChange({ maxPrice: parseFloat(e.target.value) })}
        />
      </div>
    </div>
  );
};