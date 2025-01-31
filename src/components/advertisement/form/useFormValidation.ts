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
          "birth_date",
          "height",
          "weight",
          "category",
          "ethnicity",
          "hair_color",
          "body_type",
          "silicone",
          "contact_phone",
          "state",
          "city",
          "neighborhood",
        ];
        break;
      case 2:
        fieldsToValidate = [
          "hourly_rate",
          "style",
          "services",
          "serviceLocations",
          "description",
        ];
        break;
      case 3:
        // Get the current form values
        const values = form.getValues();
        const isEditing = Boolean(values.id);

        // Check profile photo
        if (!values.profile_photo && !isEditing) {
          toast.error("Foto de perfil é obrigatória");
          return false;
        }

        // Check photos
        if (!values.photos?.length && !isEditing) {
          toast.error("Pelo menos uma foto é obrigatória");
          return false;
        }

        // Check identity document
        if (!values.identityDocument && !isEditing) {
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