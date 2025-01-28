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
import { AdCategory, ServiceType, ServiceLocationType } from "@/types/advertisement";

type Filters = {
  category?: AdCategory;
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
  services?: ServiceType[];
  serviceLocations?: ServiceLocationType[];
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
  const [ageRange, setAgeRange] = useState([18, 60]);

  const handleTempFilterChange = (newFilters: Partial<Filters>) => {
    setTempFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleAgeChange = (value: number[]) => {
    setAgeRange(value);
    handleTempFilterChange({
      minAge: value[0],
      maxAge: value[1],
    });
  };

  const handleLocationToggle = (locationId: ServiceLocationType) => {
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
          className="relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 ease-out group px-6 py-3 rounded-full"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/50 to-violet-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center gap-3">
            <SlidersHorizontal className="h-5 w-5 transition-transform group-hover:scale-110" />
            <span className="font-medium text-base">Filtrar Anúncios</span>
          </div>
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
                        : (category as AdCategory)
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
          <PriceFilter filters={tempFilters} onFilterChange={handleTempFilterChange} />

          {/* Faixa de Idade */}
          <AgeFilter ageRange={ageRange} onAgeChange={handleAgeChange} />

          {/* Características Físicas e outros filtros */}
          <BasicFilters filters={tempFilters} handleFilterChange={handleTempFilterChange} />

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
