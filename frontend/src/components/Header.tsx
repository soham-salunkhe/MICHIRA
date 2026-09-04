import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Globe,
  User,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

const NAV_LINKS = [
  { name: 'Wonders', path: '/explore' },
  { name: 'Journeys', path: '/planner' },
  { name: 'Insights', path: '/reviews' },
  { name: 'Experiences', path: '/experiences' },
  { name: 'Analytics', path: '/admin' },
];

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="header"
      className={`michira-header ${scrolled ? 'scrolled' : ''}`}
      role="banner"
    >
      <div className="container" style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 40px' }}>
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg viewBox="0 0 40 40" fill="none" width="30" height="30" style={{ flexShrink: 0 }}>
              <path d="M20 3 L27 13 L27 16 L13 16 L13 13 Z" fill="#B99550" />
              <rect x="15" y="16" width="10" height="16" fill="none" stroke="#B99550" strokeWidth="1" />
              <path d="M11 32 H29 V36 H11 Z" fill="#B99550" opacity="0.9" />
              <circle cx="20" cy="9" r="1.4" fill="#0B0D0D" />
            </svg>
            <Link
              to="/"
              className="brand-name"
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '22px',
                letterSpacing: '0.14em',
                fontWeight: 600,
                color: 'var(--ink)',
                textDecoration: 'none',
              }}
            >
              MICHIRA
            </Link>
          </div>

          <div className="nav-center" style={{ display: 'flex', gap: '38px' }}>
            {NAV_LINKS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  fontSize: '13px',
                  letterSpacing: '0.03em',
                  color: 'var(--ink-2)',
                  position: 'relative',
                  transition: 'color .3s ease',
                  padding: '4px 0',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--ink)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--ink-2)';
                }}
              >
                {item.name}
                <span
                  style={{
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    bottom: '-2px',
                    width: 0,
                    height: '1px',
                    background: 'var(--gold-2)',
                    transition: 'width .35s ease',
                  }}
                />
              </Link>
            ))}
          </div>

          <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
            <button
              className="icon-btn"
              aria-label="Search"
              style={{
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--ink-2)',
                borderRadius: '50%',
                transition: 'all .3s ease',
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--ink)';
                e.currentTarget.style.background = 'rgba(243, 239, 230, 0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--ink-2)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <Search width="18" height="18" strokeWidth={1.5} />
            </button>

            <div className="lang-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--ink-2)', cursor: 'pointer' }}>
              <Globe width="16" height="16" strokeWidth={1.5} />
              <span>EN</span>
            </div>

            <button
              className="icon-btn"
              aria-label="Profile"
              style={{
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--ink-2)',
                borderRadius: '50%',
                transition: 'all .3s ease',
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--ink)';
                e.currentTarget.style.background = 'rgba(243, 239, 230, 0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--ink-2)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <User width="18" height="18" strokeWidth={1.5} />
            </button>

            <Link
              to="/ai-tourism-planner"
              className="btn-gold"
              style={{ textDecoration: 'none' }}
            >
              <Sparkles width="14" height="14" />
              <span>Plan with AI</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};