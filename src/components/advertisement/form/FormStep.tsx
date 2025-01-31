import { motion } from "framer-motion";

interface FormStepProps {
  isActive: boolean;
  children: React.ReactNode;
}

export const FormStep = ({ isActive, children }: FormStepProps) => {
  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {children}
    </motion.div>
  );
};