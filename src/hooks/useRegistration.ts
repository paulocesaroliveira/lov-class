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

      // Check if user exists using a safer method
      const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers({
        filters: {
          email: data.email
        }
      });

      if (getUserError) {
        console.error('Error checking existing user:', getUserError);
        toast.error("Erro ao verificar usuário existente");
        return false;
      }

      if (users && users.length > 0) {
        toast.error("Este email já está cadastrado");
        navigate('/login');
        return false;
      }

      // If user doesn't exist, proceed with signup
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          }
        }
      });

      if (signUpError) {
        // Handle specific error cases
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

      if (signUpData?.user) {
        toast.success("Conta criada com sucesso! Você já pode fazer login.");
        navigate('/login');
        return true;
      }

      toast.error("Erro inesperado no cadastro. Por favor, tente novamente.");
      return false;

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