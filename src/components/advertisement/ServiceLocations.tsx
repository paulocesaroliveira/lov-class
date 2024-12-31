import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./advertisementSchema";
import { serviceLocations, ServiceLocationType } from "./serviceLocations";

type ServiceLocationsProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
};

export const ServiceLocations = ({ form }: ServiceLocationsProps) => {
  return (
    <div className="glass-card p-6 space-y-6">
      <h2 className="text-xl font-semibold">Atende em</h2>

      <FormField
        control={form.control}
        name="serviceLocations"
        render={() => (
          <FormItem>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {serviceLocations.map((location) => (
                <FormField
                  key={location.id}
                  control={form.control}
                  name="serviceLocations"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={location.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(location.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, location.id as ServiceLocationType])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== location.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {location.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};