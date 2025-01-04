import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
      // Primeiro, verificar se o usuário já existe
      const { data: existingUser } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (existingUser?.user) {
        toast({
          title: "Usuário já cadastrado",
          description: "Este email já está cadastrado. Por favor, faça login.",
          variant: "destructive",
        });
        return false;
      }

      // Se não existir, criar novo usuário
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message === 'User already registered') {
          toast({
            title: "Email já cadastrado",
            description: "Este email já está cadastrado. Por favor, faça login.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro no cadastro",
            description: "Ocorreu um erro ao criar sua conta. Por favor, tente novamente.",
            variant: "destructive",
          });
        }
        return false;
      }

      if (!signUpData.user) {
        toast({
          title: "Erro no cadastro",
          description: "Não foi possível criar sua conta. Por favor, tente novamente.",
          variant: "destructive",
        });
        return false;
      }

      // Aguardar a criação do perfil
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Conta criada com sucesso!",
        description: "Verifique seu e-mail para confirmar o cadastro.",
      });
      return true;

    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Erro no cadastro",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
        variant: "destructive",
      });
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