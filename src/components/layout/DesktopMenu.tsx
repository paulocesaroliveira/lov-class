import { MenuItem } from "./navigationUtils";

export interface DesktopMenuProps {
  menuItems: MenuItem[];
  onLogout: () => Promise<void>;
}

export const DesktopMenu = ({ menuItems, onLogout }: DesktopMenuProps) => {
  return (
    <nav className="desktop-menu">
      <ul>
        {menuItems.map((item) => (
          <li key={item.label}>
            <a href={item.path}>{item.label}</a>
          </li>
        ))}
        <li>
          <button onClick={onLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};
