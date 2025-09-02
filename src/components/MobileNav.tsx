import { NavLink } from 'react-router-dom';
import { Map, Layers, Route, Brain, Flag, Info } from 'lucide-react';
import './MobileNav.css';

const MobileNav = () => {

  const navItems = [
    { path: '/', icon: Map, label: 'Map' },
    { path: '/toggles', icon: Layers, label: 'Layers' },
    { path: '/routes', icon: Route, label: 'Routes' },
    { path: '/insights', icon: Brain, label: 'Insights' },
    { path: '/report', icon: Flag, label: 'Report' },
    { path: '/legend', icon: Info, label: 'Legend' }
  ];

  return (
    <nav className="mobile-nav" role="navigation" aria-label="Main navigation">
      {navItems.map(({ path, icon: Icon, label }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) => 
            `mobile-nav-item ${isActive ? 'active' : ''}`
          }
          aria-label={`Navigate to ${label}`}
        >
          <Icon size={20} aria-hidden="true" />
          <span className="mobile-nav-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileNav;