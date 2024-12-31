import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

type AgeFilterProps = {
  ageRange: number[];
  onAgeChange: (value: number[]) => void;
};

export const AgeFilter = ({ ageRange, onAgeChange }: AgeFilterProps) => {
  return (
    <div className="space-y-4">
      <Label>Faixa de Idade (anos)</Label>
      <Slider
        min={18}
        max={80}
        step={1}
        value={ageRange}
        onValueChange={onAgeChange}
        className="mt-2"
      />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{ageRange[0]} anos</span>
        <span>{ageRange[1]} anos</span>
      </div>
    </div>
  );
};