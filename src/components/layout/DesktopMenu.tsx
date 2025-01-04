import { Link } from 'react-router-dom';
import { useNavigation } from './Navigation';
import { Button } from '@/components/ui/button';

export const DesktopMenu = () => {
  const { menuItems, authItems } = useNavigation();

  return (
    <div className="hidden md:flex items-center gap-4">
      <nav className="flex items-center gap-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2 border-l pl-4 ml-4 border-border">
        {authItems.map((item) => (
          item.onClick ? (
            <Button
              key={item.label}
              variant="ghost"
              onClick={item.onClick}
              className="flex items-center gap-2 text-foreground/60 hover:text-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          ) : (
            <Link
              key={item.path}
              to={item.path || ''}
              className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        ))}
      </div>
    </div>
  );
};