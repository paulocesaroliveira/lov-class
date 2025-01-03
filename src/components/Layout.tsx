import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { DesktopMenu } from './layout/DesktopMenu';
import { MobileMenu } from './layout/MobileMenu';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      <nav className="glass-card sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-xl font-bold text-primary">
              Lov Class
            </Link>

            <DesktopMenu />

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

        <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </nav>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="glass-card mt-auto py-6">
        <div className="container mx-auto px-4 text-center text-sm text-foreground/60">
          © 2024 Lov Class. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default Layout;