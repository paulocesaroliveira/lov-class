import { MenuItem } from "./navigationUtils";

export interface MobileMenuProps {
  menuItems: MenuItem[];
  isOpen: boolean;
  onClose: () => void;
  onThemeToggle: () => void;
  theme: string;
  onLogout: () => Promise<void>;
}

export const MobileMenu = ({ menuItems, isOpen, onClose, onThemeToggle, theme, onLogout }: MobileMenuProps) => {
  return (
    <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
      <button onClick={onClose}>Close</button>
      <div className="theme-toggle">
        <button onClick={onThemeToggle}>
          Switch to {theme === 'light' ? 'dark' : 'light'} mode
        </button>
      </div>
      <ul>
        {menuItems.map(item => (
          <li key={item.label}>
            <a href={item.link} onClick={onClose}>{item.label}</a>
          </li>
        ))}
      </ul>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};
