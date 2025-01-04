import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { BasicFilters } from "./filters/BasicFilters";
import { PriceFilter } from "./filters/PriceFilter";
import { AgeFilter } from "./filters/AgeFilter";
import { ServiceLocationsFilter } from "./ServiceLocationsFilter";
import { styles } from "./constants";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

type Filters = {
  category?: "mulher" | "trans" | "homem";
  state?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minAge?: number;
  maxAge?: number;
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
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<Filters>({
    services: [],
    serviceLocations: [],
  });
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [ageRange, setAgeRange] = useState([18, 60]);

  const handleTempFilterChange = (newFilters: Partial<Filters>) => {
    setTempFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    handleTempFilterChange({
      minPrice: value[0],
      maxPrice: value[1],
    });
  };

  const handleAgeChange = (value: number[]) => {
    setAgeRange(value);
    handleTempFilterChange({
      minAge: value[0],
      maxAge: value[1],
    });
  };

  const handleLocationToggle = (locationId: string) => {
    const currentLocations = tempFilters.serviceLocations || [];
    const updatedLocations = currentLocations.includes(locationId)
      ? currentLocations.filter((id) => id !== locationId)
      : [...currentLocations, locationId];

    handleTempFilterChange({ serviceLocations: updatedLocations });
  };

  const applyFilters = () => {
    onFilterChange(tempFilters);
    setIsOpen(false);
    toast.success("Filtros aplicados com sucesso!");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
          {/* Categoria */}
          <div className="space-y-2">
            <Label>Categoria</Label>
            <div className="grid grid-cols-3 gap-2">
              {["mulher", "trans", "homem"].map((category) => (
                <Button
                  key={category}
                  variant={tempFilters.category === category ? "default" : "outline"}
                  onClick={() =>
                    handleTempFilterChange({
                      category: tempFilters.category === category 
                        ? undefined 
                        : (category as "mulher" | "trans" | "homem")
                    })
                  }
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Faixa de Preço */}
          <PriceFilter priceRange={priceRange} onPriceChange={handlePriceChange} />

          {/* Faixa de Idade */}
          <AgeFilter ageRange={ageRange} onAgeChange={handleAgeChange} />

          {/* Características Físicas e outros filtros */}
          <BasicFilters filters={tempFilters} onFilterChange={handleTempFilterChange} />

          {/* Estilo */}
          <div className="space-y-4">
            <Label>Estilo</Label>
            <RadioGroup
              value={tempFilters.style}
              onValueChange={(value) => handleTempFilterChange({ style: value })}
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
            selectedLocations={tempFilters.serviceLocations || []}
            onLocationToggle={handleLocationToggle}
          />
        </div>

        <SheetFooter className="mt-6">
          <Button 
            onClick={applyFilters}
            className="w-full"
            size="lg"
          >
            Aplicar Filtros
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};