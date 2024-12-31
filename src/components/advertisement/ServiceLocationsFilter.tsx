import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { serviceLocations } from "./serviceLocations";

type ServiceLocationsFilterProps = {
  selectedLocations: string[];
  onLocationToggle: (locationId: string) => void;
};

export const ServiceLocationsFilter = ({
  selectedLocations,
  onLocationToggle,
}: ServiceLocationsFilterProps) => {
  return (
    <div className="space-y-4">
      <Label>Atende em</Label>
      <div className="grid grid-cols-1 gap-3">
        {serviceLocations.map((location) => (
          <div key={location.id} className="flex items-center space-x-2">
            <Checkbox
              id={location.id}
              checked={selectedLocations.includes(location.id)}
              onCheckedChange={() => onLocationToggle(location.id)}
            />
            <label
              htmlFor={location.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {location.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};