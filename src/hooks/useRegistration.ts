import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface RegistrationData {
  email: string;
  password: string;
  name: string;
}

export const useRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const register = async (data: RegistrationData) => {
    if (!data.email || !data.password || !data.name) {
      toast.error("Por favor, preencha todos os campos");
      return false;
    }

    if (data.password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return false;
    }

    setIsLoading(true);

    try {
      // Step 1: Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
        },
      });

      if (signUpError) {
        console.error('Erro no cadastro:', signUpError);
        
        if (signUpError.message.includes('User already registered')) {
          toast.error("Este email já está cadastrado", {
            duration: 4000,
            action: {
              label: "Ir para login",
              onClick: () => navigate('/login')
            }
          });
          return false;
        }

        toast.error("Erro no cadastro. Por favor, tente novamente");
        return false;
      }

      if (!authData.user) {
        toast.error("Erro ao criar usuário");
        return false;
      }

      // Step 2: Create the user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name: data.name,
          role: 'cliente'
        });

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError);
        
        // If profile creation fails, we should clean up by deleting the auth user
        // But we can't since we don't have admin access, so we'll just show an error
        toast.error("Erro ao criar perfil de usuário");
        return false;
      }

      toast.success("Conta criada com sucesso! Redirecionando para o login...");
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

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
    register,
    isLoading
  };
};