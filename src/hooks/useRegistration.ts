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
      // Primeiro, verificamos se o usuário já existe
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.email)
        .maybeSingle();

      if (existingUser) {
        toast.error("Este email já está cadastrado", {
          duration: 4000,
          action: {
            label: "Ir para login",
            onClick: () => navigate('/login')
          }
        });
        setIsLoading(false);
        return false;
      }

      // Se não existe, tentamos criar o usuário
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

      // Mostra mensagem de sucesso e redireciona
      toast.success("Conta criada com sucesso! Redirecionando para o login...", {
        duration: 2000,
      });
      
      // Delay para garantir que o usuário veja a mensagem
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