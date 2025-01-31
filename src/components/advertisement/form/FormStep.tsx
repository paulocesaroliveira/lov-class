interface FormStepProps {
  isActive: boolean;
  children: React.ReactNode;
}

export const FormStep = ({ isActive, children }: FormStepProps) => {
  if (!isActive) return null;
  return <>{children}</>;
};