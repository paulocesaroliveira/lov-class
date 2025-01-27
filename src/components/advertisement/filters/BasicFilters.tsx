import { useEffect } from 'react';
import { Filters } from '../types';

export interface BasicFiltersProps {
  filters: Filters;
  onFilterChange: (newFilters: Partial<Filters>) => void;
}

export const BasicFilters = ({ filters, onFilterChange }: BasicFiltersProps) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ search: event.target.value });
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ city: event.target.value });
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    onFilterChange({ [name]: value ? parseFloat(value) : undefined });
  };

  useEffect(() => {
    // Any side effects can be handled here
  }, [filters]);

  return (
    <div className="flex flex-col space-y-4">
      <input
        type="text"
        placeholder="Search..."
        value={filters.search}
        onChange={handleSearchChange}
        className="border p-2"
      />
      <select
        value={filters.city}
        onChange={handleCityChange}
        className="border p-2"
      >
        <option value="">Select City</option>
        {/* Add city options here */}
      </select>
      <div className="flex space-x-2">
        <input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          value={filters.minPrice || ''}
          onChange={handlePriceChange}
          className="border p-2"
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={filters.maxPrice || ''}
          onChange={handlePriceChange}
          className="border p-2"
        />
      </div>
    </div>
  );
};
