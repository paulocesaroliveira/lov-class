import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { DesktopMenu } from './layout/DesktopMenu';
import { MobileMenu } from './layout/MobileMenu';
import { useNavigation } from './layout/navigationUtils';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const MemoizedDesktopMenu = memo(DesktopMenu);
const MemoizedMobileMenu = memo(MobileMenu);

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { menuItems } = useNavigation();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Logout realizado com sucesso');
      navigate('/login');
    } catch (error: any) {
      console.error('Erro ao fazer logout:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  // Move all hooks to the top level and combine them into a single useCallback
  const handlers = React.useMemo(() => ({
    toggleMenu: () => setIsMenuOpen(prev => !prev),
    closeMenu: () => setIsMenuOpen(false),
    toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark')
  }), [theme, setTheme]);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <nav className="sticky top-0 z-50 glass-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-xl font-bold text-primary animate-fade-in">
              Lov Class
            </Link>

            <div className="flex items-center gap-4">
              <MemoizedDesktopMenu 
                menuItems={menuItems} 
                onLogout={handleLogout}
              />
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handlers.toggleTheme}
                className="hidden md:flex"
                aria-label="Alternar tema"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              <button
                className="md:hidden p-2 hover:bg-primary/10 rounded-lg transition-colors"
                onClick={handlers.toggleMenu}
                aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        <MemoizedMobileMenu 
          menuItems={menuItems} 
          isOpen={isMenuOpen} 
          onClose={handlers.closeMenu}
          onThemeToggle={handlers.toggleTheme}
          theme={theme}
          onLogout={handleLogout}
        />
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