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
      // Tenta criar o usuário diretamente
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
        },
      });

      if (signUpError) {
        // Verifica especificamente o erro de usuário já existente
        if (signUpError.message.includes('User already registered') || 
            signUpError.message.includes('user_already_exists')) {
          toast.error("Este email já está cadastrado", {
            duration: 4000,
            action: {
              label: "Ir para login",
              onClick: () => navigate('/login')
            }
          });
          return false;
        }

        console.error('Erro detalhado no cadastro:', signUpError);
        toast.error("Erro no cadastro. Por favor, tente novamente");
        return false;
      }

      // Mostra mensagem de sucesso e redireciona
      toast.success("Conta criada com sucesso! Redirecionando para o login...");
      
      // Redireciona após um breve delay
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