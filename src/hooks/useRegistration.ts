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
      // Tentar criar o usuário
      const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
        },
      });

      if (signUpError) {
        console.error('Erro detalhado no cadastro:', signUpError);
        
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

      // Criar perfil do usuário com role 'cliente'
      if (signUpData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: signUpData.user.id,
            name: data.name,
            role: 'cliente'
          });

        if (profileError) {
          console.error('Erro ao criar perfil:', profileError);
          toast.error("Erro ao criar perfil de usuário");
          return false;
        }
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