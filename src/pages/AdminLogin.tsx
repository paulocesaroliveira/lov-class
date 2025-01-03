import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // Verificar se o usuário é admin
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session?.user.id)
        .single();

      if (profileError) throw profileError;

      if (profile?.role !== "admin") {
        await supabase.auth.signOut();
        throw new Error("Acesso não autorizado. Apenas administradores podem acessar esta área.");
      }

      toast.success("Login administrativo realizado com sucesso!");
      navigate("/admin");
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer login");
      console.error("Admin login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <div className="flex justify-center">
          <Shield className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Login Administrativo</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Área restrita para administradores
        </p>
      </div>
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="admin@exemplo.com"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          />
        </div>
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </div>
  );
};

export default AdminLogin;