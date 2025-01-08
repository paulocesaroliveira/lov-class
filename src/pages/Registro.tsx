import { Link } from 'react-router-dom';
import { RegistrationForm } from '@/components/auth/RegistrationForm';

const Registro = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="max-w-md w-full space-y-8 p-8 glass-card">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">Criar nova conta</h2>
          <p className="text-muted-foreground mt-2">
            Preencha os dados abaixo para criar sua conta
          </p>
        </div>
        
        <RegistrationForm />

        <p className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link 
            to="/login" 
            className="text-primary hover:underline font-medium"
          >
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Registro;