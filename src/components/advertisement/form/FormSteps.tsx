import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../advertisementSchema";
import { BasicInformation } from "../BasicInformation";
import { Appearance } from "../Appearance";
import { ContactOptions } from "../ContactOptions";
import { ContactLocation } from "../ContactLocation";
import { CustomRates } from "../CustomRates";
import { StyleSelection } from "../StyleSelection";
import { ServicesSelection } from "../ServicesSelection";
import { ServiceLocations } from "../ServiceLocations";
import { Description } from "../Description";
import { MediaUploadField } from "../MediaUploadField";
import { IdentityDocument } from "../IdentityDocument";
import { TermsAndConditions } from "../TermsAndConditions";

type FormStepsProps = {
  currentStep: number;
  form: UseFormReturn<z.infer<typeof formSchema>>;
  setIdentityDocument: (file: File | null) => void;
};

export const FormSteps = ({ currentStep, form, setIdentityDocument }: FormStepsProps) => {
  return (
    <>
      <FormStep isActive={currentStep === 1}>
        <BasicInformation form={form} />
        <Appearance form={form} />
        <ContactOptions form={form} />
        <ContactLocation form={form} />
      </FormStep>

      <FormStep isActive={currentStep === 2}>
        <CustomRates form={form} />
        <StyleSelection form={form} />
        <ServicesSelection form={form} />
        <ServiceLocations form={form} />
        <Description form={form} />
      </FormStep>

      <FormStep isActive={currentStep === 3}>
        <div className="glass-card p-6 space-y-6">
          <h2 className="text-xl font-semibold">Fotos e Vídeos</h2>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="profile_photo"
              render={({ field }) => (
                <MediaUploadField
                  label="Foto de Perfil"
                  accept="image/*"
                  maxFiles={1}
                  {...field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="photos"
              render={({ field }) => (
                <MediaUploadField
                  label="Álbum de Fotos"
                  accept="image/*"
                  multiple
                  maxFiles={15}
                  {...field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="videos"
              render={({ field }) => (
                <MediaUploadField
                  label="Álbum de Vídeos"
                  accept="video/*"
                  multiple
                  maxFiles={8}
                  maxSize={50}
                  {...field}
                />
              )}
            />
          </div>
        </div>
        <IdentityDocument 
          form={form} 
          setIdentityDocument={setIdentityDocument}
        />
      </FormStep>

      <FormStep isActive={currentStep === 4}>
        <TermsAndConditions form={form} />
      </FormStep>
    </>
  );
};