import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/types/advertisement";

interface ContactOptionsProps {
  form: UseFormReturn<FormValues>;
}

export const ContactOptions = ({ form }: ContactOptionsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="contact_phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefone de contato</FormLabel>
            <FormControl>
              <Input placeholder="(11) 99999-9999" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <div className="space-y-2">
        <FormLabel>Meios de contato</FormLabel>
        <div className="flex flex-col gap-2">
          <FormField
            control={form.control}
            name="contact_whatsapp"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  WhatsApp
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contact_telegram"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Telegram
                </FormLabel>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};