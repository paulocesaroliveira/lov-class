import { Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { MenuItem } from './navigationUtils';
import { Button } from '../ui/button';

interface MobileMenuProps {
  menuItems: MenuItem[];
  isOpen: boolean;
  onClose: () => void;
  onThemeToggle: () => void;
  theme?: string;
}

export const MobileMenu = ({ menuItems, isOpen, onClose, onThemeToggle, theme }: MobileMenuProps) => {
  if (!isOpen) return null;

  const handleItemClick = (onClick?: () => void) => {
    if (onClick) {
      onClick();
    }
    onClose();
  };

  return (
    <div className="md:hidden fixed inset-x-0 top-16 bg-background/80 backdrop-blur-lg border-t border-border animate-fade-in">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex flex-col gap-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center gap-2 p-2 rounded-lg text-foreground/60 hover:text-foreground hover:bg-primary/10 transition-colors"
              onClick={() => handleItemClick(item.onClick)}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
          <Button
            variant="ghost"
            className="justify-start gap-2"
            onClick={onThemeToggle}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-4 w-4" />
                Tema Claro
              </>
            ) : (
              <>
                <Moon className="h-4 w-4" />
                Tema Escuro
              </>
            )}
          </Button>
        </nav>
      </div>
    </div>
  );
};