import { useEffect } from 'react';
import { Filters } from '@/types/advertisement';

export interface BasicFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  city: string;
  onCityChange: (value: string) => void;
  minPrice?: number;
  maxPrice?: number;
  onPriceChange: (min?: number, max?: number) => void;
}

export const BasicFilters = ({
  searchTerm,
  onSearchChange,
  city,
  onCityChange,
  minPrice,
  maxPrice,
  onPriceChange
}: BasicFiltersProps) => {
  useEffect(() => {
    // Any side effects can be handled here
  }, [searchTerm, city, minPrice, maxPrice]);

  return (
    <div className="flex flex-col space-y-4">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="border p-2 rounded"
      />
      <select
        value={city}
        onChange={(e) => onCityChange(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Select City</option>
        {/* Add city options here */}
      </select>
      <div className="flex space-x-2">
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice || ''}
          onChange={(e) => onPriceChange(e.target.value ? Number(e.target.value) : undefined, maxPrice)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice || ''}
          onChange={(e) => onPriceChange(minPrice, e.target.value ? Number(e.target.value) : undefined)}
          className="border p-2 rounded"
        />
      </div>
    </div>
  );
};