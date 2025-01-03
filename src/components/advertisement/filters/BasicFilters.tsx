import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type BasicFiltersProps = {
  filters: any;
  onFilterChange: (filters: any) => void;
};

export const BasicFilters = ({ filters, onFilterChange }: BasicFiltersProps) => {
  return (
    <div className="space-y-6">
      {/* Categoria */}
      <div className="space-y-2">
        <Label>Categoria</Label>
        <div className="grid grid-cols-3 gap-2">
          {["mulher", "trans", "homem"].map((category) => (
            <Button
              key={category}
              variant={filters.category === category ? "default" : "outline"}
              onClick={() =>
                onFilterChange({
                  category: filters.category === category ? undefined : category,
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
            onChange={(e) => onFilterChange({ state: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Cidade</Label>
          <Input
            placeholder="Ex: São Paulo"
            value={filters.city || ""}
            onChange={(e) => onFilterChange({ city: e.target.value })}
          />
        </div>
      </div>

      {/* Características Físicas */}
      <div className="space-y-4">
        <Label>Características Físicas</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Altura Mínima (cm)</Label>
            <Input
              type="number"
              placeholder="Ex: 160"
              value={filters.minHeight || ""}
              onChange={(e) => onFilterChange({ minHeight: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Altura Máxima (cm)</Label>
            <Input
              type="number"
              placeholder="Ex: 180"
              value={filters.maxHeight || ""}
              onChange={(e) => onFilterChange({ maxHeight: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Peso Mínimo (kg)</Label>
            <Input
              type="number"
              placeholder="Ex: 50"
              value={filters.minWeight || ""}
              onChange={(e) => onFilterChange({ minWeight: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Peso Máximo (kg)</Label>
            <Input
              type="number"
              placeholder="Ex: 80"
              value={filters.maxWeight || ""}
              onChange={(e) => onFilterChange({ maxWeight: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Etnia */}
      <div className="space-y-2">
        <Label>Etnia</Label>
        <RadioGroup
          value={filters.ethnicity || ""}
          onValueChange={(value) => onFilterChange({ ethnicity: value })}
          className="grid grid-cols-3 gap-4"
        >
          {["branca", "negra", "oriental"].map((ethnicity) => (
            <div key={ethnicity} className="flex items-center space-x-2">
              <RadioGroupItem value={ethnicity} id={ethnicity} />
              <Label htmlFor={ethnicity} className="capitalize">
                {ethnicity}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Cor do Cabelo */}
      <div className="space-y-2">
        <Label>Cor do Cabelo</Label>
        <RadioGroup
          value={filters.hairColor || ""}
          onValueChange={(value) => onFilterChange({ hairColor: value })}
          className="grid grid-cols-2 gap-4"
        >
          {["morena", "loira", "ruiva", "colorido"].map((color) => (
            <div key={color} className="flex items-center space-x-2">
              <RadioGroupItem value={color} id={color} />
              <Label htmlFor={color} className="capitalize">
                {color}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Tipo Corporal */}
      <div className="space-y-2">
        <Label>Tipo Corporal</Label>
        <RadioGroup
          value={filters.bodyType || ""}
          onValueChange={(value) => onFilterChange({ bodyType: value })}
          className="grid grid-cols-2 gap-4"
        >
          {["magra", "gordinha"].map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <RadioGroupItem value={type} id={type} />
              <Label htmlFor={type} className="capitalize">
                {type}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};