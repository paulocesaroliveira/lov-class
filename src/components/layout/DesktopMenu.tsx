import { Link } from 'react-router-dom';
import { useNavigation } from './Navigation';
import { Button } from '@/components/ui/button';

export const DesktopMenu = () => {
  const { menuItems, authItems } = useNavigation();

  return (
    <div className="hidden md:flex items-center gap-4">
      {menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className="text-foreground/60 hover:text-foreground transition-colors"
        >
          {item.label}
        </Link>
      ))}

      <div className="flex items-center gap-2">
        {authItems.map((item) => (
          item.onClick ? (
            <Button
              key={item.label}
              variant="ghost"
              onClick={item.onClick}
              className="text-foreground/60 hover:text-foreground"
            >
              {item.label}
            </Button>
          ) : (
            <Link
              key={item.path}
              to={item.path || ''}
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          )
        ))}
      </div>
    </div>
  );
};