import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff } from 'lucide-react';

const Registro = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement registration logic
    toast({
      title: "Conta criada com sucesso!",
      description: "Você já pode fazer login.",
    });
  };

  return (
    <div className="max-w-md mx-auto glass-card p-8">
      <h2 className="text-2xl font-bold text-center mb-6">Criar Conta</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Nome
          </label>
          <input
            id="name"
            type="text"
            required
            className="input-styled"
            placeholder="Seu nome"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            required
            className="input-styled"
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Senha
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              className="input-styled pr-10"
              placeholder="********"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/70 hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button type="submit" className="btn-primary w-full">
          Criar Conta
        </button>

        <p className="text-center text-sm text-foreground/70">
          Já tem uma conta?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Fazer login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Registro;