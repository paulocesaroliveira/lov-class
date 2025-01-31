import { Link } from "react-router-dom";
import { MenuItem } from "./navigationUtils";
import { cn } from "@/lib/utils";

export interface DesktopMenuProps {
  menuItems: MenuItem[];
  onLogout: () => Promise<void>;
}

export const DesktopMenu = ({ menuItems, onLogout }: DesktopMenuProps) => {
  return (
    <nav className="hidden md:flex items-center gap-1">
      {menuItems.map((item) => (
        <Link
          key={item.label}
          to={item.href}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md",
            "text-muted-foreground hover:text-foreground",
            "hover:bg-accent hover:text-accent-foreground",
            "transition-colors duration-200"
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
      <button
        onClick={onLogout}
        className={cn(
          "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md",
          "text-muted-foreground hover:text-foreground",
          "hover:bg-accent hover:text-accent-foreground",
          "transition-colors duration-200"
        )}
      >
        Sair
      </button>
    </nav>
  );
};