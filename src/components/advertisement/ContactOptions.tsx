import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/types/advertisement";
import InputMask from "react-input-mask";

interface ContactOptionsProps {
  form: UseFormReturn<FormValues>;
}

export const ContactOptions = ({ form }: ContactOptionsProps) => {
  return (
    <div className="glass-card p-6 space-y-6">
      <h2 className="text-xl font-semibold">Contato</h2>

      <FormField
        control={form.control}
        name="contact_phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefone de contato</FormLabel>
            <FormControl>
              <InputMask
                mask="(99)99999-9999"
                value={field.value}
                onChange={field.onChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="(11)99999-9999"
              />
            </FormControl>
            <FormMessage />
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