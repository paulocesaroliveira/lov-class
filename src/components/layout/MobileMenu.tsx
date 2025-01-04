import { useNavigation } from './Navigation';
import { Button } from '@/components/ui/button';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const { menuItems, authItems, handleNavigation } = useNavigation();

  if (!isOpen) return null;

  const handleItemClick = (path: string) => {
    handleNavigation(path);
    onClose();
  };

  return (
    <div className="md:hidden fixed inset-x-0 top-16 bg-background/80 backdrop-blur-lg border-t border-border">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex flex-col gap-4">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleItemClick(item.path)}
              className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}

          <div className="border-t border-border pt-4 mt-2">
            {authItems.map((item) => (
              item.onClick ? (
                <Button
                  key={item.label}
                  variant="ghost"
                  onClick={() => {
                    item.onClick?.();
                    onClose();
                  }}
                  className="w-full justify-start gap-2 text-foreground/60 hover:text-foreground"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              ) : (
                <button
                  key={item.path}
                  onClick={() => handleItemClick(item.path || '')}
                  className="flex w-full items-center gap-2 text-foreground/60 hover:text-foreground transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              )
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};