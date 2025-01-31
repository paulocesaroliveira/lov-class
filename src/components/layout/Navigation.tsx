import React, { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { DesktopMenu } from './DesktopMenu';
import { MobileMenu } from './MobileMenu';
import { useNavigation } from './navigationUtils';
import { useTheme } from 'next-themes';
import { Button } from '../ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const MemoizedDesktopMenu = memo(DesktopMenu);
const MemoizedMobileMenu = memo(MobileMenu);

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { menuItems } = useNavigation();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleClose = React.useCallback(() => {
    setIsMenuOpen(false);
  }, []);

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

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <DesktopMenu menuItems={menuItems} onLogout={handleLogout} />
          <MobileMenu 
            menuItems={menuItems} 
            isOpen={isMenuOpen} 
            onClose={handleClose}
            onThemeToggle={toggleTheme}
            theme={theme}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </nav>
  );
};