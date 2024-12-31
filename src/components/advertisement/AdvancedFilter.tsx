import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { BasicFilters } from "./filters/BasicFilters";
import { PriceFilter } from "./filters/PriceFilter";
import { ServiceLocationsFilter } from "./ServiceLocationsFilter";
import { styles } from "./constants";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Filters = {
  category?: "mulher" | "trans" | "homem";
  state?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minHeight?: number;
  maxHeight?: number;
  minWeight?: number;
  maxWeight?: number;
  ethnicity?: string;
  hairColor?: string;
  bodyType?: string;
  services?: string[];
  serviceLocations?: string[];
  style?: string;
};

type AdvancedFilterProps = {
  onFilterChange: (filters: Filters) => void;
};

export const AdvancedFilter = ({ onFilterChange }: AdvancedFilterProps) => {
  const [filters, setFilters] = useState<Filters>({
    services: [],
    serviceLocations: [],
  });
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    handleFilterChange({
      minPrice: value[0],
      maxPrice: value[1],
    });
  };

  const handleLocationToggle = (locationId: string) => {
    const currentLocations = filters.serviceLocations || [];
    const updatedLocations = currentLocations.includes(locationId)
      ? currentLocations.filter((id) => id !== locationId)
      : [...currentLocations, locationId];

    handleFilterChange({ serviceLocations: updatedLocations });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="default"
          size="lg"
          className="gap-2 shadow-lg hover:shadow-xl transition-all duration-200 bg-primary font-semibold"
        >
          <SlidersHorizontal className="h-5 w-5" />
          Filtros Avançados
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filtros Avançados</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <BasicFilters filters={filters} onFilterChange={handleFilterChange} />
          <PriceFilter priceRange={priceRange} onPriceChange={handlePriceChange} />

          {/* Estilo */}
          <div className="space-y-4">
            <Label>Estilo</Label>
            <RadioGroup
              value={filters.style}
              onValueChange={(value) => handleFilterChange({ style: value })}
              className="grid grid-cols-2 gap-4"
            >
              {styles.map((style) => (
                <div key={style.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={style.value} id={style.value} />
                  <Label htmlFor={style.value}>{style.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Locais de Atendimento */}
          <ServiceLocationsFilter
            selectedLocations={filters.serviceLocations || []}
            onLocationToggle={handleLocationToggle}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};