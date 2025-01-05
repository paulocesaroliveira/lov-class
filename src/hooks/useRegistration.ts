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

      // Try to sign up the user without email confirmation redirect
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
        console.error('Registration error:', signUpError);
        
        // Check for user already exists error
        if (signUpError.message.includes('User already registered') || 
            signUpError.message.includes('user_already_exists')) {
          toast.error("Este email já está cadastrado. Por favor, faça login.");
          navigate('/login');
          return false;
        }

        // Handle other error cases
        if (signUpError.message.includes('Password')) {
          toast.error("A senha deve ter pelo menos 6 caracteres");
        } else if (signUpError.message.includes('Email')) {
          toast.error("Por favor, insira um email válido");
        } else {
          toast.error("Erro no cadastro. Por favor, tente novamente");
          console.error('Detailed error:', signUpError);
        }
        return false;
      }

      toast.success("Conta criada com sucesso! Você já pode fazer login.");
      navigate('/login');
      return true;

    } catch (error) {
      console.error('Unexpected registration error:', error);
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