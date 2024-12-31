import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { SlidersHorizontal, X } from "lucide-react";
import { services } from "./constants";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ServiceLocationsFilter } from "./ServiceLocationsFilter";
import { styles } from "./constants";
import { Checkbox } from "@/components/ui/checkbox";

type Filters = {
  category?: "mulher" | "trans" | "homem";
  state?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
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

  const handleServiceToggle = (serviceId: string) => {
    const currentServices = filters.services || [];
    const updatedServices = currentServices.includes(serviceId)
      ? currentServices.filter((id) => id !== serviceId)
      : [...currentServices, serviceId];

    handleFilterChange({ services: updatedServices });
  };

  const handleLocationToggle = (locationId: string) => {
    const currentLocations = filters.serviceLocations || [];
    const updatedLocations = currentLocations.includes(locationId)
      ? currentLocations.filter((id) => id !== locationId)
      : [...currentLocations, locationId];

    handleFilterChange({ serviceLocations: updatedLocations });
  };

  const handleStyleChange = (value: string | undefined) => {
    if (value === filters.style) {
      handleFilterChange({ style: undefined });
    } else {
      handleFilterChange({ style: value });
    }
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
          {/* Categoria */}
          <div className="space-y-2">
            <Label>Categoria</Label>
            <div className="grid grid-cols-3 gap-2">
              {["mulher", "trans", "homem"].map((category) => (
                <Button
                  key={category}
                  variant={filters.category === category ? "default" : "outline"}
                  onClick={() =>
                    handleFilterChange({
                      category: category as "mulher" | "trans" | "homem",
                    })
                  }
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Localização */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Estado</Label>
              <Input
                placeholder="Ex: SP"
                value={filters.state || ""}
                onChange={(e) => handleFilterChange({ state: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Cidade</Label>
              <Input
                placeholder="Ex: São Paulo"
                value={filters.city || ""}
                onChange={(e) => handleFilterChange({ city: e.target.value })}
              />
            </div>
          </div>

          {/* Faixa de Preço */}
          <div className="space-y-4">
            <Label>Faixa de Preço (R$)</Label>
            <Slider
              min={0}
              max={1000}
              step={50}
              value={priceRange}
              onValueChange={(value) => {
                setPriceRange(value);
                handleFilterChange({
                  minPrice: value[0],
                  maxPrice: value[1],
                });
              }}
              className="mt-2"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>R$ {priceRange[0]}</span>
              <span>R$ {priceRange[1]}</span>
            </div>
          </div>

          {/* Estilo */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Estilo</Label>
              {filters.style && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFilterChange({ style: undefined })}
                  className="h-8 px-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <RadioGroup
              value={filters.style}
              onValueChange={handleStyleChange}
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

          {/* Serviços */}
          <div className="space-y-4">
            <Label>Serviços</Label>
            <div className="grid grid-cols-1 gap-3">
              {services.map((service) => (
                <div key={service.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={service.id}
                    checked={(filters.services || []).includes(service.id)}
                    onCheckedChange={() => handleServiceToggle(service.id)}
                  />
                  <label
                    htmlFor={service.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {service.label}
                  </label>
                </div>
              ))}
            </div>
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