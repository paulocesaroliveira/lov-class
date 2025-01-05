import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export interface RegistrationData {
  name: string;
  email: string;
  password: string;
}

export const useRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const register = async (data: RegistrationData) => {
    try {
      setIsLoading(true);
      
      // Basic validation
      if (!data.email || !data.password || !data.name) {
        toast.error("Por favor, preencha todos os campos");
        return false;
      }

      if (data.password.length < 6) {
        toast.error("A senha deve ter pelo menos 6 caracteres");
        return false;
      }

      // Try to sign up directly - Supabase will handle duplicate users
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          }
        }
      });

      if (signUpError) {
        if (signUpError.message.includes('User already registered')) {
          toast.error("Este email já está cadastrado");
          navigate('/login');
          return false;
        }
        
        console.error('Erro no cadastro:', signUpError);
        toast.error("Erro no cadastro. Por favor, tente novamente");
        return false;
      }

      toast.success("Conta criada com sucesso! Você já pode fazer login.");
      navigate('/login');
      return true;

    } catch (error) {
      console.error('Erro inesperado no cadastro:', error);
      toast.error("Ocorreu um erro inesperado. Por favor, tente novamente");
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