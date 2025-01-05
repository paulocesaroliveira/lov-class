import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '@/types/advertisement';
import { toast } from 'sonner';

export const useAutoSave = (form: UseFormReturn<FormValues>) => {
  useEffect(() => {
    const saveToLocalStorage = () => {
      const values = form.getValues();
      localStorage.setItem('advertisement-draft', JSON.stringify(values));
      toast.success('Rascunho salvo automaticamente', {
        duration: 2000,
      });
    };

    const interval = setInterval(saveToLocalStorage, 30000); // Auto-save a cada 30 segundos

    return () => clearInterval(interval);
  }, [form]);

  const loadDraft = () => {
    const draft = localStorage.getItem('advertisement-draft');
    if (draft) {
      form.reset(JSON.parse(draft));
      toast.info('Rascunho carregado');
    }
  };

  const clearDraft = () => {
    localStorage.removeItem('advertisement-draft');
  };

  return { loadDraft, clearDraft };
};