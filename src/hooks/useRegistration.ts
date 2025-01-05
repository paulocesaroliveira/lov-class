import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface RegistrationData {
  name: string;
  email: string;
  password: string;
}

export const useRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);

  const register = async (data: RegistrationData) => {
    setIsLoading(true);
    
    try {
      console.log('Starting registration process with data:', { 
        email: data.email, 
        name: data.name,
        // Don't log password for security
      });

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (signUpError) {
        console.error('Registration error:', signUpError);
        
        if (signUpError.message.includes('User already registered')) {
          toast.error("Este email já está cadastrado. Por favor, faça login.");
        } else if (signUpError.message.includes('Password')) {
          toast.error("A senha deve ter pelo menos 6 caracteres.");
        } else if (signUpError.message.includes('Email')) {
          toast.error("Por favor, insira um email válido.");
        } else {
          toast.error("Erro no cadastro. Por favor, tente novamente.");
        }
        return false;
      }

      if (!signUpData.user) {
        console.error('No user data returned after signup');
        toast.error("Não foi possível criar sua conta. Por favor, tente novamente.");
        return false;
      }

      console.log('Registration successful:', signUpData.user.id);
      toast.success("Conta criada com sucesso! Verifique seu e-mail para confirmar o cadastro.");
      return true;

    } catch (error) {
      console.error('Unexpected registration error:', error);
      toast.error("Ocorreu um erro inesperado. Por favor, tente novamente.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    register,
  };
};