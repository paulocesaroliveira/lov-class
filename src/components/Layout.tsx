import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, UserPlus, User, Home, Grid } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const { session } = useAuth();

  const menuItems = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/anuncios', label: 'Anúncios', icon: Grid },
  ];

  // Show these items only when user is NOT logged in
  const authItems = !session ? [
    { path: '/login', label: 'Entrar', icon: LogIn },
    { path: '/registro', label: 'Cadastrar', icon: UserPlus },
  ] : [
    { path: '/perfil', label: 'Perfil', icon: User }
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="glass-card sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-xl font-bold text-primary">
              ClassiAds
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${
                    location.pathname === item.path ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center gap-2">
                {authItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`btn-primary flex items-center gap-2 ${
                        item.path === '/registro' ? 'btn-secondary' : ''
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden glass-card absolute top-16 left-0 right-0 p-4">
            <div className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${
                    location.pathname === item.path ? 'text-primary' : 'text-foreground'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
              {authItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`btn-primary flex items-center justify-center gap-2 ${
                      item.path === '/registro' ? 'btn-secondary' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="glass-card mt-auto py-6">
        <div className="container mx-auto px-4 text-center text-sm text-foreground/60">
          © 2024 ClassiAds. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default Layout;