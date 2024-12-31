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
import { Checkbox } from "@/components/ui/checkbox";
import { SlidersHorizontal } from "lucide-react";
import { services } from "./constants";
import { Input } from "../ui/input";

type Filters = {
  category?: "mulher" | "trans" | "homem";
  state?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  services?: string[];
};

type AdvancedFilterProps = {
  onFilterChange: (filters: Filters) => void;
};

export const AdvancedFilter = ({ onFilterChange }: AdvancedFilterProps) => {
  const [filters, setFilters] = useState<Filters>({
    services: [],
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

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
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
        </div>
      </SheetContent>
    </Sheet>
  );
};