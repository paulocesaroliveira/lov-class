import { Link } from 'react-router-dom';
import { MenuItem } from './Navigation';

interface MobileMenuProps {
  menuItems: MenuItem[];
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ menuItems, isOpen, onClose }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden absolute left-0 right-0 top-16 bg-background/80 backdrop-blur-lg border-t border-border">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex flex-col gap-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors"
              onClick={onClose}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};