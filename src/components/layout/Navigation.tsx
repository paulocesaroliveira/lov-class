import { useAuth } from "@/hooks/useAuth";
import { DesktopMenu } from "./DesktopMenu";
import { MobileMenu } from "./MobileMenu";

export const Navigation = () => {
  const { session } = useAuth();

  const menuItems = [
    { label: "Início", href: "/" },
    { label: "Feed", href: "/feed" },
    { label: "Anúncios", href: "/anuncios" },
    ...(session?.user
      ? [
          { label: "Favoritos", href: "/favoritos" },
          { label: "Perfil", href: "/perfil" },
        ]
      : [
          { label: "Login", href: "/login" },
          { label: "Registro", href: "/registro" },
        ]),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <DesktopMenu items={menuItems} />
          <MobileMenu items={menuItems} />
        </div>
      </div>
    </nav>
  );
};