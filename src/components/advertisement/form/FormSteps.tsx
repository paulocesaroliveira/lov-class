import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/types/advertisement";
import { FormStep } from "./FormStep";
import { BasicInformation } from "../BasicInformation";
import { Appearance } from "../Appearance";
import { ContactOptions } from "../ContactOptions";
import { ContactLocation } from "../ContactLocation";
import { CustomRates } from "../CustomRates";
import { StyleSelection } from "../StyleSelection";
import { ServicesSelection } from "../ServicesSelection";
import { ServiceLocations } from "../ServiceLocations";
import { Description } from "../Description";
import { MediaUpload } from "../MediaUpload";
import { IdentityDocument } from "../IdentityDocument";
import { TermsAndConditions } from "../TermsAndConditions";

interface FormStepsProps {
  currentStep: number;
  form: UseFormReturn<FormValues>;
  setIdentityDocument: (file: File | null) => void;
}

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
        <MediaUpload
          setProfilePhoto={(file) => form.setValue("profile_photo", file)}
          setPhotos={(files) => form.setValue("photos", files)}
          setVideos={(files) => form.setValue("videos", files)}
        />
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