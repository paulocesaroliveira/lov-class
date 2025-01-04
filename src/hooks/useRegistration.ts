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
      // First check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', data.email)
        .maybeSingle();

      if (existingUser) {
        toast({
          title: "Email já cadastrado",
          description: "Este email já está em uso. Por favor, use outro email ou faça login.",
          variant: "destructive",
        });
        return false;
      }

      // Attempt to sign up the user
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
        console.error('Signup error:', signUpError);
        
        if (signUpError.message.includes('User already registered')) {
          toast({
            title: "Email já cadastrado",
            description: "Este email já está em uso. Por favor, use outro email ou faça login.",
            variant: "destructive",
          });
          return false;
        }

        toast({
          title: "Erro no cadastro",
          description: signUpError.message || "Ocorreu um erro ao criar sua conta. Tente novamente.",
          variant: "destructive",
        });
        return false;
      }

      if (!signUpData.user) {
        toast({
          title: "Erro no cadastro",
          description: "Não foi possível criar sua conta. Tente novamente.",
          variant: "destructive",
        });
        return false;
      }

      // Wait for the database trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check if profile was created
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', signUpData.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Profile check error:', profileError);
        toast({
          title: "Erro na verificação do perfil",
          description: "Sua conta foi criada, mas houve um problema ao configurar seu perfil.",
          variant: "destructive",
        });
        return false;
      }

      if (!profileData) {
        console.error('Profile not found after creation');
        toast({
          title: "Erro na criação do perfil",
          description: "Sua conta foi criada, mas houve um problema ao configurar seu perfil. Por favor, tente fazer login.",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Conta criada com sucesso!",
        description: "Verifique seu e-mail para confirmar o cadastro.",
      });
      return true;

    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Erro ao criar conta",
        description: "Ocorreu um erro inesperado. Tente novamente.",
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