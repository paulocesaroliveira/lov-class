import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MenuItem } from './Navigation';

interface MobileMenuProps {
  menuItems: MenuItem[];
}

export const MobileMenu = ({ menuItems }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleItemClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-16 bg-background/80 backdrop-blur-lg border-t border-border">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col gap-4">
              {menuItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleItemClick(item.href)}
                  className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};