import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

type PriceFilterProps = {
  priceRange: number[];
  onPriceChange: (value: number[]) => void;
};

export const PriceFilter = ({ priceRange, onPriceChange }: PriceFilterProps) => {
  return (
    <div className="space-y-4">
      <Label>Faixa de Preço (R$)</Label>
      <Slider
        min={0}
        max={1000}
        step={50}
        value={priceRange}
        onValueChange={onPriceChange}
        className="mt-2"
      />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>R$ {priceRange[0]}</span>
        <span>R$ {priceRange[1]}</span>
      </div>
    </div>
  );
};