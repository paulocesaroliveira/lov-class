import { Link } from 'react-router-dom';
import { Navigation } from './Navigation';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const { menuItems, authItems, handleNavigation, location } = Navigation();

  if (!isOpen) return null;

  return (
    <div className="md:hidden glass-card absolute top-16 left-0 right-0 p-4">
      <div className="flex flex-col space-y-4">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => {
              handleNavigation(item.path);
              onClose();
            }}
            className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${
              location.pathname === item.path ? 'text-primary' : 'text-foreground'
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
        {authItems.map((item) => {
          const Icon = item.icon;
          return item.onClick ? (
            <button
              key={item.label}
              onClick={() => {
                item.onClick();
                onClose();
              }}
              className="btn-primary flex items-center justify-center gap-2"
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          ) : (
            <Link
              key={item.path}
              to={item.path}
              className={`btn-primary flex items-center justify-center gap-2 ${
                item.path === '/registro' ? 'btn-secondary' : ''
              }`}
              onClick={onClose}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};