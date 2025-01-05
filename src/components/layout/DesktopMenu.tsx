import { Link } from 'react-router-dom';
import { MenuItem } from './Navigation';

interface DesktopMenuProps {
  menuItems: MenuItem[];
}

export const DesktopMenu = ({ menuItems }: DesktopMenuProps) => {
  return (
    <div className="hidden md:flex items-center gap-4">
      <nav className="flex items-center gap-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};