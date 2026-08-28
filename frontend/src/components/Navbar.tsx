import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Wonders', path: '/explore' },
    { name: 'Journeys', path: '/planner' },
    { name: 'Insights', path: '/reviews' },
    { name: 'Experiences', path: '/experiences' },
    { name: 'Analytics', path: '/admin' },
  ];

  return (
    <header className="w-full py-5 px-4 sm:px-8">
      <div className="max-w-[1360px] mx-auto w-full">
        <div className="flex items-center justify-between">
          {/* Brand with logo */}
          <Link
            to="/"
            className="flex items-center gap-3 text-[#F1F0EB] hover:text-[#B49A68] transition-colors"
          >
            <svg viewBox="0 0 40 40" fill="none" className="w-[30px] h-[30px] flex-shrink-0">
              <path d="M20 3 L27 13 L27 16 L13 16 L13 13 Z" fill="#B99550" />
              <rect x="15" y="16" width="10" height="16" fill="none" stroke="#B99550" strokeWidth="1" />
              <path d="M11 32 H29 V36 H11 Z" fill="#B99550" opacity="0.9" />
              <circle cx="20" cy="9" r="1.4" fill="#0B0D0D" />
            </svg>
            <span className="font-serif-heading text-[22px] tracking-[0.14em] font-semibold text-[#F1F0EB]">
              Michira
            </span>
          </Link>

          {/* Center Nav */}
          <nav className="hidden lg:flex items-center gap-[38px]">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-[13px] tracking-[0.03em] transition-colors relative ${
                    isActive
                      ? 'text-[#F1F0EB] font-medium'
                      : 'text-[#B4B2AA] hover:text-[#F1F0EB] font-normal'
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute left-0 -bottom-[3px] h-px bg-[#D2A95D] transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0'
                    }`}
                  ></span>
                </Link>
              );
            })}
          </nav>

          {/* Right CTA */}
          <Link
            to="/planner"
            className="btn-gold rounded-full"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Plan with AI</span>
          </Link>
        </div>

        {/* Mobile Nav */}
        <div className="flex lg:hidden overflow-x-auto py-3 gap-5 mt-1 no-scrollbar">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`whitespace-nowrap text-[13px] tracking-[0.03em] ${
                  isActive ? 'text-[#F1F0EB] font-medium' : 'text-[#B4B2AA]'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};
