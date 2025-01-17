import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./advertisementSchema";
import { services } from "./constants";
import { ServiceType } from "@/types/advertisement";

type ServicesSelectionProps = {
  form?: UseFormReturn<z.infer<typeof formSchema>>;
  services?: { service: ServiceType }[];
};

export const ServicesSelection = ({ form, services: servicesList }: ServicesSelectionProps) => {
  // If we're in read-only mode (no form provided)
  if (!form && servicesList) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {servicesList.map((svc) => (
          <div key={svc.service} className="flex items-center space-x-2">
            <Checkbox checked disabled />
            <span className="text-sm">{svc.service}</span>
          </div>
        ))}
      </div>
    );
  }

  // Form mode
  if (!form) return null;

  return (
    <div className="glass-card p-6 space-y-6">
      <h2 className="text-xl font-semibold">Serviços</h2>

      <FormField
        control={form.control}
        name="services"
        render={() => (
          <FormItem>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <FormField
                  key={service.id}
                  control={form.control}
                  name="services"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={service.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(service.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, service.id as ServiceType])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== service.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {service.label}
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