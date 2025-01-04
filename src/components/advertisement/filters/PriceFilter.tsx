import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type PriceFilterProps = {
  filters: any;
  onFilterChange: (filters: any) => void;
};

export const PriceFilter = ({ filters, onFilterChange }: PriceFilterProps) => {
  return (
    <div className="space-y-4">
      <Label>Faixa de Preço (R$)</Label>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Valor Mínimo</Label>
          <Input
            type="number"
            placeholder="Ex: 100"
            value={filters.minPrice || ""}
            onChange={(e) => onFilterChange({ minPrice: Number(e.target.value) || undefined })}
          />
        </div>
        <div className="space-y-2">
          <Label>Valor Máximo</Label>
          <Input
            type="number"
            placeholder="Ex: 1000"
            value={filters.maxPrice || ""}
            onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) || undefined })}
          />
        </div>
      </div>
    </div>
  );
};