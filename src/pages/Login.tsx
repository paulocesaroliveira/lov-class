import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAndRedirect = async () => {
      if (session) {
        const state = location.state as { returnTo?: string } | null;
        navigate(state?.returnTo || "/");
      }
    };

    checkAndRedirect();
  }, [session, navigate, location.state]);

  useEffect(() => {
    const state = location.state as { message?: string } | null;
    if (state?.message) {
      toast.error(state.message);
    }
  }, [location.state]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Previne múltiplos cliques
    setLoading(true);

    try {
      // Limpa qualquer sessão existente
      await supabase.auth.signOut();

      // Tenta fazer login
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        if (authError.message === "Invalid login credentials") {
          toast.error("Email ou senha incorretos");
        } else if (authError.message.includes("Email not confirmed")) {
          toast.error("Por favor, confirme seu email antes de fazer login");
        } else {
          toast.error("Erro ao fazer login: " + authError.message);
        }
        setLoading(false);
        return;
      }

      if (!authData.user) {
        toast.error("Erro ao recuperar dados do usuário");
        setLoading(false);
        return;
      }

      // Verifica se o perfil existe
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Erro ao verificar perfil:", profileError);
        toast.error("Erro ao verificar perfil de usuário");
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      if (!profile) {
        // Cria o perfil se não existir
        const { error: createProfileError } = await supabase
          .from("profiles")
          .insert([
            {
              id: authData.user.id,
              name: email.split("@")[0],
              role: "user",
            },
          ]);

        if (createProfileError) {
          console.error("Erro ao criar perfil:", createProfileError);
          toast.error("Erro ao criar perfil de usuário");
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }
      }

      const state = location.state as { returnTo?: string } | null;
      toast.success("Login realizado com sucesso!");
      navigate(state?.returnTo || "/");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Erro ao fazer login. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Entrar</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Entre com seu email e senha
        </p>
      </div>
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="seu@email.com"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
      <div className="text-center text-sm">
        Não tem uma conta?{" "}
        <Link to="/registro" className="underline">
          Registre-se
        </Link>
      </div>
    </div>
  );
};

export default Login;