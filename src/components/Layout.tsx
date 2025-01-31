import { useState } from "react";
import { Outlet } from "react-router-dom";
import { DesktopMenu } from "./layout/DesktopMenu";
import { MobileMenu } from "./layout/MobileMenu";
import { useNavigation } from "./layout/navigationUtils";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

export const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { menuItems, handleLogout } = useNavigation();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <DesktopMenu 
              menuItems={menuItems} 
              onThemeToggle={toggleTheme} 
              theme={theme || "light"}
              onLogout={handleLogout}
            />
          </div>
          <Button
            variant="ghost"
            className="inline-flex items-center justify-center rounded-md md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </div>
      </header>

      <MobileMenu
        menuItems={menuItems}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onThemeToggle={toggleTheme}
        theme={theme || "light"}
        onLogout={handleLogout}
      />

      <main className="container py-6">
        <Outlet />
      </main>
    </div>
  );
};