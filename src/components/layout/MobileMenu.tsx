import { Link } from "react-router-dom";
import { MenuItem } from "./navigationUtils";
import { cn } from "@/lib/utils";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface MobileMenuProps {
  menuItems: MenuItem[];
  isOpen: boolean;
  onClose: () => void;
  onThemeToggle: () => void;
  theme: string;
  onLogout: () => Promise<void>;
}

export const MobileMenu = ({
  menuItems,
  isOpen,
  onClose,
  onThemeToggle,
  theme,
  onLogout,
}: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-background p-6 shadow-lg">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" size="icon" onClick={onThemeToggle}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Fechar
            </Button>
          </div>

          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md",
                  "text-muted-foreground hover:text-foreground",
                  "hover:bg-accent hover:text-accent-foreground",
                  "transition-colors duration-200"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md",
                "text-muted-foreground hover:text-foreground",
                "hover:bg-accent hover:text-accent-foreground",
                "transition-colors duration-200"
              )}
            >
              Sair
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};