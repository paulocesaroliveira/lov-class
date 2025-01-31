import { Link } from 'react-router-dom';
import { MenuItem } from './navigationUtils';

interface DesktopMenuProps {
  menuItems: MenuItem[];
  onLogout: () => Promise<void>;
}

export const DesktopMenu = ({ menuItems, onLogout }: DesktopMenuProps) => {
  return (
    <div className="hidden md:flex items-center gap-1">
      <nav className="flex items-center gap-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={item.label === "Sair" ? onLogout : item.onClick}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/60 hover:text-foreground hover:bg-primary/10 transition-colors"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};