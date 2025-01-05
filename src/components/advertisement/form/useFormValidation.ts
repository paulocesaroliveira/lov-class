import { FormValues } from "@/types/advertisement";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

export const useFormValidation = (form: UseFormReturn<FormValues>) => {
  const validateStep = async (step: number) => {
    let fieldsToValidate: (keyof FormValues)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = [
          "name",
          "birthDate",
          "height",
          "weight",
          "category",
          "ethnicity",
          "hairColor",
          "bodyType",
          "silicone",
          "contact_phone",
          "state",
          "city",
          "neighborhood",
        ];
        break;
      case 2:
        fieldsToValidate = [
          "hourlyRate",
          "style",
          "services",
          "serviceLocations",
          "description",
        ];
        break;
      case 3:
        if (!form.getValues("profilePhoto") && !form.getValues("advertisement")?.profile_photo_url) {
          toast.error("Foto de perfil é obrigatória");
          return false;
        }
        if (!form.getValues("photos")?.length && !form.getValues("advertisement")?.advertisement_photos?.length) {
          toast.error("Pelo menos uma foto é obrigatória");
          return false;
        }
        if (!form.getValues("identityDocument") && !form.getValues("advertisement")) {
          toast.error("Documento de identidade é obrigatório");
          return false;
        }
        return true;
      case 4:
        fieldsToValidate = ["acceptTerms"];
        break;
    }

    const result = await form.trigger(fieldsToValidate);
    if (!result) {
      const errors = form.formState.errors;
      const firstError = fieldsToValidate.find(field => errors[field]);
      if (firstError && errors[firstError]) {
        const errorMessage = typeof errors[firstError]?.message === 'string' 
          ? errors[firstError]?.message 
          : "Por favor, preencha todos os campos obrigatórios";
        toast.error(errorMessage);
      }
    }
    return result;
  };

  return { validateStep };
};