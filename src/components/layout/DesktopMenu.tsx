import { Link } from 'react-router-dom';
import { Navigation } from './Navigation';

export const DesktopMenu = () => {
  const { menuItems, authItems, handleNavigation, location } = Navigation();

  return (
    <div className="hidden md:flex items-center space-x-4">
      {menuItems.map((item) => (
        <button
          key={item.path}
          onClick={() => handleNavigation(item.path)}
          className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${
            location.pathname === item.path ? 'text-primary' : 'text-foreground'
          }`}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </button>
      ))}
      <div className="flex items-center gap-2">
        {authItems.map((item) => {
          const Icon = item.icon;
          return item.onClick ? (
            <button
              key={item.label}
              onClick={item.onClick}
              className="btn-primary flex items-center gap-2"
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          ) : (
            <Link
              key={item.path}
              to={item.path}
              className={`btn-primary flex items-center gap-2 ${
                item.path === '/registro' ? 'btn-secondary' : ''
              }`}
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