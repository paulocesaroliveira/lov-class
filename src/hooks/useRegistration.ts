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
      console.log("Iniciando registro do usuário...");
      
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
        console.error('Erro no cadastro:', signUpError);
        
        if (signUpError.message.includes('already registered')) {
          toast.error("Este email já está cadastrado");
          navigate('/login');
          return false;
        }

        toast.error("Erro no cadastro. Por favor, tente novamente");
        return false;
      }

      if (!signUpData.user) {
        console.error('Nenhum usuário retornado após o cadastro');
        toast.error("Erro no cadastro. Por favor, tente novamente");
        return false;
      }

      console.log("Usuário registrado com sucesso:", signUpData.user);

      // Criar perfil do usuário
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: signUpData.user.id,
          name: data.name,
          role: 'user'
        });

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError);
        if (profileError.code === '23505') { // Unique violation
          console.log("Perfil já existe, ignorando erro de duplicação");
        } else {
          toast.error("Erro ao criar perfil de usuário");
          return false;
        }
      }

      toast.success("Conta criada com sucesso! Verifique seu email para confirmar o cadastro.");
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
    register,
    isLoading
  };
};