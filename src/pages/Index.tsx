import { Link } from 'react-router-dom';
import { Search, Heart, Shield } from 'lucide-react';

const Index = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Bem-vindo ao ClassiAds
        </h1>
        <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
          A melhor plataforma de classificados adultos do Brasil.
          Encontre ou publique anúncios de forma simples e segura.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/anuncios" className="btn-primary">
            Ver Anúncios
          </Link>
          <Link to="/criar-anuncio" className="btn-secondary">
            Publicar Anúncio
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="glass-card p-6 text-center space-y-4">
          <Search size={40} className="mx-auto text-primary" />
          <h3 className="text-xl font-semibold">Busca Inteligente</h3>
          <p className="text-foreground/70">
            Encontre exatamente o que procura com nossos filtros avançados
          </p>
        </div>

        <div className="glass-card p-6 text-center space-y-4">
          <Heart size={40} className="mx-auto text-secondary" />
          <h3 className="text-xl font-semibold">Perfis Verificados</h3>
          <p className="text-foreground/70">
            Todos os anúncios são verificados para sua segurança
          </p>
        </div>

        <div className="glass-card p-6 text-center space-y-4">
          <Shield size={40} className="mx-auto text-accent" />
          <h3 className="text-xl font-semibold">100% Seguro</h3>
          <p className="text-foreground/70">
            Sua privacidade e segurança são nossas prioridades
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;