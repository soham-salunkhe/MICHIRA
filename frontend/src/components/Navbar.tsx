import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();

  const [scrolled,     setScrolled]     = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    setScrolled(window.scrollY > 40);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close dropdown on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate('/');
  };

  // Display name: prefer displayName (set on email signup), fall back to email
  const displayName  = user?.displayName || null;
  const displayEmail = user?.email || null;
  // Short label shown in the button: first name or email prefix
  const shortLabel = displayName
    ? displayName.split(' ')[0]
    : displayEmail
      ? displayEmail.split('@')[0]
      : '';

  const navLinks = [
    { name: 'Wonders',     path: '/explore'      },
    { name: 'Journeys',    path: '/planner'       },
    { name: 'Insights',    path: '/reviews'       },
    { name: 'Experiences', path: '/experiences'   },
    { name: 'Heritage',    path: '/intelligence'  },
  ];

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-inner">

        {/* Brand */}
        <Link to="/" className="brand">
          <svg viewBox="0 0 40 40" fill="none">
            <path d="M20 3 L27 13 L27 16 L13 16 L13 13 Z" fill="#B99550" />
            <rect x="15" y="16" width="10" height="16" fill="none" stroke="#B99550" strokeWidth="1" />
            <path d="M11 32 H29 V36 H11 Z" fill="#B99550" opacity="0.9" />
            <circle cx="20" cy="9" r="1.4" fill="#0B0D0D" />
          </svg>
          <span className="brand-name">MICHIRA</span>
        </Link>

        {/* Center Nav */}
        <nav className="nav-center">
          {navLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={location.pathname === item.path ? 'active' : ''}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="nav-right">

          {isLoggedIn ? (
            /* ── LOGGED IN: user menu ── */
            <div className="nav-user-wrap" ref={menuRef}>
              <button
                className="nav-user-btn"
                onClick={() => setMenuOpen(s => !s)}
                aria-label="User menu"
                aria-expanded={menuOpen}
                aria-haspopup="true"
              >
                {/* Avatar circle */}
                <span className="nav-avatar" aria-hidden="true">
                  {(displayName?.[0] || displayEmail?.[0] || '?').toUpperCase()}
                </span>
                <span className="nav-user-label">{shortLabel}</span>
                {/* chevron */}
                <svg
                  width="12" height="12" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2"
                  style={{ transition: 'transform 0.2s', transform: menuOpen ? 'rotate(180deg)' : 'none' }}
                  aria-hidden="true"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {menuOpen && (
                <div className="nav-user-dropdown" role="menu">
                  {/* Identity */}
                  <div className="nav-user-info">
                    {displayName && (
                      <span className="nav-user-info-name">{displayName}</span>
                    )}
                    {displayEmail && (
                      <span className="nav-user-info-email">{displayEmail}</span>
                    )}
                  </div>
                  <div className="nav-user-divider" />
                  <Link to="/planner" className="nav-user-item" role="menuitem">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
                    </svg>
                    My Journeys
                  </Link>
                  <button
                    className="nav-user-item nav-user-signout"
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ── LOGGED OUT: sign in icon ── */
            <Link to="/login" aria-label="Sign in">
              <button className="icon-btn" style={{ pointerEvents: 'none' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
                </svg>
              </button>
            </Link>
          )}

          {/* Plan with AI CTA */}
          <Link to="/planner" className="btn-gold">
            Plan with AI ✦
          </Link>
        </div>
      </div>
    </header>
  );
};
