import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Create a client outside of component to avoid recreation on each render
const queryClient = new QueryClient();

// Separate the content component
const AdminLoginContent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { session } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (session) {
    console.info("User is already logged in as admin, redirecting...");
    navigate("/admin");
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user is admin
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (profileError) throw profileError;

      if (profile?.role !== "admin") {
        await supabase.auth.signOut();
        toast.error("Você não tem permissão para acessar esta página");
        return;
      }

      navigate("/admin");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-6 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold">Login Administrativo</h2>
          <p className="text-muted-foreground">
            Faça login para acessar o painel administrativo
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
};

// Main component with providers
const AdminLogin = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AdminLoginContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default AdminLogin;