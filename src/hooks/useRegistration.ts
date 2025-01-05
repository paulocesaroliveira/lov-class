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
      // Basic validation
      if (!data.email || !data.password || !data.name) {
        toast.error("Por favor, preencha todos os campos");
        return false;
      }

      if (data.password.length < 6) {
        toast.error("A senha deve ter pelo menos 6 caracteres");
        return false;
      }

      console.log('Starting registration process with data:', { 
        email: data.email, 
        name: data.name,
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
        
        // Handle specific error cases
        switch (true) {
          case signUpError.message.includes('User already registered'):
            toast.error("Este email já está cadastrado. Por favor, faça login.");
            break;
          case signUpError.message.includes('Password'):
            toast.error("A senha deve ter pelo menos 6 caracteres.");
            break;
          case signUpError.message.includes('Email'):
            toast.error("Por favor, insira um email válido.");
            break;
          case signUpError.message.includes('422'):
            toast.error("Dados inválidos. Verifique as informações fornecidas.");
            break;
          default:
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