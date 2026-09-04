import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthGuard } from '../hooks/useAuthGuard';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';

/**
 * Hero carousel slides. Each slide carries its own overlay copy so the text
 * always describes the image currently on screen.
 * Ratings / review counts are presentational placeholders, not live API data.
 */
const HERO_SLIDES = [
  {
    src: '/img/3.jpg',
    alt: 'Garuda Wisnu Kencana statue',
    eyebrow: 'VISHNU & GARUDA',
    era: 'CARVED IN BRONZE',
    titleLines: ['Garuda Wisnu', 'Kencana'],
    rating: '4.8',
    reviews: '3.1K traveler reviews',
    href: '/explore',
  },
  {
    src: '/taj-mahal-hd.jpg',
    alt: 'Taj Mahal, Agra',
    eyebrow: 'MUGHAL EMPIRE',
    era: '17TH CENTURY',
    titleLines: ['Taj Mahal', 'of Agra'],
    rating: '4.9',
    reviews: '4.6K traveler reviews',
    href: '/destination/agra',
  },
  {
    src: '/img/ellora.jpg',
    alt: 'Ellora Caves, Maharashtra',
    eyebrow: 'RASHTRAKUTA DYNASTY',
    era: '6TH–10TH CENTURY',
    titleLines: ['Ellora', 'Rock Caves'],
    rating: '4.8',
    reviews: '1.9K traveler reviews',
    href: '/explore',
  },
  // Red Fort slide — no image asset exists in the project yet. Drop a photo at
  // public/img/red-fort.jpg and uncomment to enable.
  // {
  //   src: '/img/red-fort.jpg',
  //   alt: 'Red Fort, Delhi',
  //   eyebrow: 'MUGHAL EMPIRE',
  //   era: '17TH CENTURY',
  //   titleLines: ['Red Fort', 'of Delhi'],
  //   rating: '4.7',
  //   reviews: '3.8K traveler reviews',
  //   href: '/destination/delhi',
  // },
];

export const LandingPage = () => {
  const guard = useAuthGuard();
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const activeSlide = HERO_SLIDES[currentImageIndex];

  const displayName  = user?.displayName || null;
  const displayEmail = user?.email || null;
  const shortLabel   = displayName
    ? displayName.split(' ')[0]
    : displayEmail ? displayEmail.split('@')[0] : '';
  const avatarLetter = (displayName?.[0] || displayEmail?.[0] || '?').toUpperCase();

  useEffect(() => {
    const handleScroll = () => {
      setHeaderScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % HERO_SLIDES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('in');
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => io.observe(el));

    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="landing-wrapper">
      {/* NAVBAR */}
      <header id="header" className={headerScrolled ? 'scrolled' : ''}>
        <nav className="container">
          <div className="brand">
            <svg viewBox="0 0 40 40" fill="none">
              <path d="M20 3 L27 13 L27 16 L13 16 L13 13 Z" fill="#B99550" />
              <rect x="15" y="16" width="10" height="16" fill="none" stroke="#B99550" strokeWidth="1" />
              <path d="M11 32 H29 V36 H11 Z" fill="#B99550" opacity="0.9" />
              <circle cx="20" cy="9" r="1.4" fill="#0B0D0D" />
            </svg>
            <span className="brand-name">MICHIRA</span>
          </div>
          <div className="nav-center">
            <a href="#discovery">Wonders</a>
            <a href="#planner">Journeys</a>
            <a href="#intelligence">Insights</a>
            <a href="#heritage">Experiences</a>
            <a href="#diya">Heritage</a>
          </div>
          <div className="nav-right">
            {isLoggedIn ? (
              /* ── Logged in: avatar + dropdown ── */
              <div className="lp-user-wrap" ref={userMenuRef}>
                <button
                  className="lp-user-btn"
                  onClick={() => setUserMenuOpen(s => !s)}
                  aria-label="User menu"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <span className="lp-avatar">{avatarLetter}</span>
                  <span className="lp-user-label">{shortLabel}</span>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" aria-hidden="true"
                    style={{ transition: 'transform .2s', transform: userMenuOpen ? 'rotate(180deg)' : 'none' }}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="lp-user-dropdown" role="menu">
                    <div className="lp-user-info">
                      {displayName  && <span className="lp-user-name">{displayName}</span>}
                      {displayEmail && <span className="lp-user-email">{displayEmail}</span>}
                    </div>
                    <div className="lp-user-divider" />
                    <button className="lp-user-item" role="menuitem"
                      onClick={() => { setUserMenuOpen(false); guard('/planner'); }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
                      </svg>
                      My Journeys
                    </button>
                    <button className="lp-user-item lp-user-signout" role="menuitem"
                      onClick={async () => { setUserMenuOpen(false); await logout(); navigate('/'); }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
              /* ── Logged out: profile icon → /login ── */
              <div className="icon-btn" aria-label="Sign in"
                onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
                </svg>
              </div>
            )}
            <button className="btn-gold" onClick={() => guard('/planner')}>Plan with AI ✦</button>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          {HERO_SLIDES.map((slide, index) => (
            <img
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              className={`hero-bg-image ${index === currentImageIndex ? 'active' : ''}`}
            />
          ))}
        </div>
        <div className="hero-scrim"></div>
        <div className="container hero-content">
          <div className="hero-grid">
            <div>
              <div className="hero-eyebrow">
                <span className="line"></span>
                <span className="eyebrow">India · Heritage · Discovery</span>
              </div>
              <h1 className="headline">
                <span className="reveal"><span style={{ animationDelay: '.35s' }}>Some places</span></span>
                <span className="reveal"><span style={{ animationDelay: '.5s' }}>are visited.</span></span>
                <span className="reveal"><span className="gold-text" style={{ animationDelay: '.68s' }}>Others are</span></span>
                <span className="reveal"><span className="gold-text" style={{ animationDelay: '.82s' }}>experienced.</span></span>
              </h1>
              <p className="sub">Discover journeys shaped by history, culture, people and the stories travelers leave behind.</p>
              <div className="hero-ctas">
                <button className="btn-gold" onClick={() => guard('/planner')}>
                  Plan My Journey
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
                <a href="#discovery" className="btn-outline">Explore India</a>
              </div>
            </div>

            <div className="hero-info-overlay">
              <div className="hero-info-content" key={currentImageIndex}>
                <div className="hero-info-eyebrow">{activeSlide.eyebrow}</div>
                <div className="hero-info-era">{activeSlide.era}</div>
                <h2 className="hero-info-title">
                  {activeSlide.titleLines.map((line, i) => (
                    <span key={i}>
                      {i > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </h2>
                <div className="hero-info-divider"></div>
                <div className="hero-info-meta">
                  <span className="hero-info-rating">★ {activeSlide.rating}</span>
                  <span className="hero-info-reviews">{activeSlide.reviews}</span>
                </div>
                <button
                  className="hero-info-explore"
                  onClick={() => guard(activeSlide.href)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
                >
                  <span>Explore</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DESTINATION DISCOVERY */}
      <section id="discovery">
        <div className="container">
          <div className="section-head reveal-on-scroll">
            <span className="eyebrow">Wonders of India</span>
            <h2>Where will your<br />story begin?</h2>
          </div>

          <div className="discovery-wrap">
            <div className="dest-grid reveal-on-scroll">
              <button onClick={() => guard('/destination/jaipur')} className="dcard jaipur" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', display: 'block', width: '100%' }}>
                <img src="/img/hawa_mahal.jpg" alt="Jaipur" />
                <div className="dcard-scrim"></div>
                <div className="dcard-info">
                  <div className="dcard-line"></div>
                  <div className="dcard-name">Jaipur</div>
                  <div className="dcard-state">Rajasthan</div>
                  <div className="dcard-extra">
                    <span className="dcard-season">Best Season · Oct – Mar</span>
                    <span className="dcard-arrow">→</span>
                  </div>
                </div>
              </button>
              <button onClick={() => guard('/destination/goa')} className="dcard goa" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', display: 'block', width: '100%' }}>
                <img src="/img/goa_beach.jpg" alt="Goa" />
                <div className="dcard-scrim"></div>
                <div className="dcard-info">
                  <div className="dcard-line"></div>
                  <div className="dcard-name">Goa</div>
                  <div className="dcard-state">Beach Paradise</div>
                  <div className="dcard-extra">
                    <span className="dcard-season">Best Season · Nov – Feb</span>
                    <span className="dcard-arrow">→</span>
                  </div>
                </div>
              </button>
              <div className="dcard varanasi">
                <img src="/img/varanasi.jpg" alt="Varanasi" />
                <div className="dcard-scrim"></div>
                <div className="dcard-info">
                  <div className="dcard-line"></div>
                  <div className="dcard-name">Varanasi</div>
                  <div className="dcard-state">Spiritual Soul</div>
                  <div className="dcard-extra">
                    <span className="dcard-season">Best Season · Oct – Mar</span>
                    <span className="dcard-arrow">→</span>
                  </div>
                </div>
              </div>
              <div className="dcard hampi">
                <img src="/img/virupaksha.jpg" alt="Hampi" />
                <div className="dcard-scrim"></div>
                <div className="dcard-info">
                  <div className="dcard-line"></div>
                  <div className="dcard-name">Hampi</div>
                  <div className="dcard-state">Karnataka</div>
                  <div className="dcard-extra">
                    <span className="dcard-season">Best Season · Oct – Feb</span>
                    <span className="dcard-arrow">→</span>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={() => guard('/explore')} className="view-all reveal-on-scroll" style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', padding: 0 }}>
              View all destinations
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* AI PLANNER */}
      <section id="planner" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            <div className="reveal-on-scroll">
              <span className="eyebrow">Your Concierge</span>
              <h2 style={{ fontSize: 'clamp(28px,3.2vw,42px)', marginTop: '16px', lineHeight: '1.16' }}>
                Tell us how you travel. We'll shape the rest.
              </h2>
              <p style={{ color: 'var(--ink-2)', fontSize: '15px', lineHeight: '1.7', marginTop: '20px', maxWidth: '420px' }}>
                MICHIRA studies your pace, your interests and your season, then drafts an itinerary
                the way a well-travelled friend would — not a generic checklist.
              </p>
            </div>
            <div className="planner reveal-on-scroll">
              <div className="planner-eyebrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
                </svg>
                <span className="eyebrow" style={{ margin: 0 }}>AI Travel Planner</span>
              </div>
              <h3>Plan your journey</h3>
              <p className="sub-small">Tell us how you travel.</p>

              <div className="p-field">
                <div className="p-field-left">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" />
                    <circle cx="12" cy="9" r="2.4" />
                  </svg>
                  <span>Where do you want to go?</span>
                </div>
                <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </div>
              <div className="p-field">
                <div className="p-field-left">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <rect x="3" y="5" width="18" height="16" rx="1" />
                    <path d="M3 10h18M8 3v4M16 3v4" />
                  </svg>
                  <span>When are you planning?</span>
                </div>
                <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </div>
              <div className="p-field">
                <div className="p-field-left">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                  <span>How many days?</span>
                </div>
                <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </div>
              <div className="p-field">
                <div className="p-field-left">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <circle cx="8" cy="8" r="3" />
                    <circle cx="17" cy="9" r="2.4" />
                    <path d="M2 20c.5-3.5 3-5.5 6-5.5s5.5 2 6 5.5M14.5 14c2.4 0 4.3 1.8 4.8 5" />
                  </svg>
                  <span>Who are you traveling with?</span>
                </div>
                <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </div>
              <div className="p-field">
                <div className="p-field-left">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <path d="M12 21c-4.5-3-8-6.5-8-10.5A5.5 5.5 0 0112 6a5.5 5.5 0 018 4.5c0 4-3.5 7.5-8 10.5z" />
                  </svg>
                  <span>Your interests</span>
                </div>
                <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </div>
              <div className="p-field">
                <div className="p-field-left">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <path d="M4 21V9l8-6 8 6v12" />
                    <path d="M9 21v-8h6v8" />
                  </svg>
                  <span>Travel style</span>
                </div>
                <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </div>

              <button className="btn-gold" onClick={() => guard('/planner')}>Create My Journey ✦</button>
            </div>
          </div>
        </div>
      </section>

      {/* TOURIST INTELLIGENCE */}
      <section id="intelligence">
        <div className="container">
          <div className="section-head reveal-on-scroll">
            <span className="eyebrow">Traveler Review Intelligence · TUR09</span>
            <h2>Travel decisions,<br />backed by travelers.</h2>
            <p>Real insights from real travelers help you explore better.</p>
          </div>

          <div className="intel-stats reveal-on-scroll">
            <div className="intel-card">
              <div className="intel-num">LIVE</div>
              <div className="intel-label">Live Sentiment</div>
              <svg className="ring" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="26" fill="none" stroke="#232522" strokeWidth="7" />
                <circle cx="32" cy="32" r="26" fill="none" stroke="#B99550" strokeWidth="7" strokeDasharray="163.4 194.5"
                  strokeLinecap="round" transform="rotate(-90 32 32)" />
              </svg>
            </div>
            <div className="intel-card">
              <div className="intel-num">—</div>
              <div className="intel-label">Live Rating</div>
              <div className="stars">★★★★★</div>
              <div style={{ fontSize: '11px', color: 'var(--ink-3)', marginTop: '8px' }}>Evidence derived per destination</div>
            </div>
            <div className="intel-card">
              <div className="intel-num">LIVE</div>
              <div className="intel-label">Reviews Indexed</div>
              <div className="bars">
                <div style={{ height: '35%' }}></div>
                <div style={{ height: '55%' }}></div>
                <div style={{ height: '40%' }}></div>
                <div style={{ height: '70%' }}></div>
                <div style={{ height: '50%' }}></div>
                <div style={{ height: '85%' }}></div>
                <div style={{ height: '60%' }}></div>
                <div style={{ height: '95%' }}></div>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--ink-3)', marginTop: '8px' }}>Loaded from PostgreSQL</div>
            </div>
          </div>

          <div className="intel-panels reveal-on-scroll">
            <div className="panel">
              <h4>Travelers Love</h4>
              <ul>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Architecture
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Food
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Atmosphere
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Locals
                </li>
              </ul>
            </div>
            <div className="panel concerns">
              <h4>Common Concerns</h4>
              <ul>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 9v4M12 17h.01M10.3 3.9L2.6 18a2 2 0 001.7 3h15.4a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
                  </svg>
                  Crowding
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 9v4M12 17h.01M10.3 3.9L2.6 18a2 2 0 001.7 3h15.4a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
                  </svg>
                  Parking
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 9v4M12 17h.01M10.3 3.9L2.6 18a2 2 0 001.7 3h15.4a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
                  </svg>
                  Heat
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 9v4M12 17h.01M10.3 3.9L2.6 18a2 2 0 001.7 3h15.4a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
                  </svg>
                  Connectivity
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* LIGHT A DIYA */}
      <section id="diya" className="diya-section">
        <div className="container">
          <div className="diya-grid">
            <div className="diya-text reveal-on-scroll">
              <span className="eyebrow">A MICHIRA Ritual</span>
              <h2 style={{ marginTop: '16px' }}>Light a Diya</h2>
              <p className="q">"Every journey leaves a little light behind."</p>
              <a href="#heritage" className="btn-outline">
                Explore Heritage
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>

              <div className="diya-journey">
                <div className="journey-step">
                  <div className="journey-num">01</div><span>Light the diya</span>
                </div>
                <div className="journey-step">
                  <div className="journey-num">02</div><span>Reveal the story</span>
                </div>
                <div className="journey-step">
                  <div className="journey-num">03</div><span>Discover the place</span>
                </div>
              </div>
            </div>

            <div className="diya-stage reveal-on-scroll">
              <svg className="temple-silhouette" viewBox="0 0 600 160" preserveAspectRatio="none">
                <path
                  d="M0 160 L0 120 L40 120 L40 90 L60 90 L60 60 L90 30 L120 60 L120 90 L150 90 L150 120 L230 120 L230 70 L250 70 L250 40 L270 20 L290 40 L290 70 L310 70 L310 120 L400 120 L400 100 L420 100 L420 80 L440 80 L440 120 L470 120 L470 95 L490 95 L490 120 L600 120 L600 160 Z"
                  fill="#0B0D0D" />
              </svg>
              <div className="diya-glow"></div>
              <svg className="diya-svg" viewBox="0 0 200 220">
                <ellipse cx="100" cy="175" rx="70" ry="14" fill="#000" opacity="0.35" />
                <path d="M20 150 Q100 195 180 150 Q170 130 100 130 Q30 130 20 150 Z" fill="#5b3a1e" />
                <path d="M20 150 Q100 168 180 150 L180 152 Q100 172 20 152 Z" fill="#3c2410" />
                <ellipse cx="100" cy="145" rx="46" ry="9" fill="#1a0f06" />
                <g className="flame">
                  <path d="M100 60 C88 82 82 100 100 118 C118 100 112 82 100 60 Z" fill="#D2A95D" />
                  <path d="M100 78 C93 92 90 103 100 116 C110 103 107 92 100 78 Z" fill="#F3D28A" />
                  <path d="M100 96 C97 104 96 109 100 116 C104 109 103 104 100 96 Z" fill="#FFF3D6" />
                </g>
                <line x1="100" y1="118" x2="100" y2="132" stroke="#2a1a0c" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* HERITAGE */}
      <section id="heritage">
        <div className="container">
          <div className="section-head reveal-on-scroll">
            <span className="eyebrow">Heritage & Culture</span>
            <h2>Before you visit,<br />know the story.</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', alignItems: 'center' }}>
            <div className="reveal-on-scroll" style={{ position: 'relative', overflow: 'hidden', height: '520px' }}>
              <img src="/img/ellora.jpg" alt="Ellora Caves"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(0.35) saturate(0.7) brightness(0.9)' }} />
              <div
                style={{ position: 'absolute', inset: '0', background: 'linear-gradient(0deg, rgba(11,13,13,0.75), transparent 45%)' }}>
              </div>
              <div style={{ position: 'absolute', left: '26px', bottom: '26px' }}>
                <div className="plaque-eyebrow">Rock-cut Marvel</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '24px', color: 'var(--ink)', marginTop: '6px' }}>
                  Ellora Caves
                </div>
              </div>
            </div>

            <div className="reveal-on-scroll">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                <div style={{ padding: '20px 0', borderBottom: '1px solid var(--hair)' }}>
                  <div className="eyebrow" style={{ marginBottom: '8px' }}>Architecture</div>
                  <p style={{ fontSize: '14px', color: 'var(--ink-2)', lineHeight: '1.6' }}>
                    34 monasteries and temples carved from a single volcanic rock face, spanning three faiths.
                  </p>
                </div>
                <div style={{ padding: '20px 0', borderBottom: '1px solid var(--hair)' }}>
                  <div className="eyebrow" style={{ marginBottom: '8px' }}>History</div>
                  <p style={{ fontSize: '14px', color: 'var(--ink-2)', lineHeight: '1.6' }}>
                    Built between the 6th and 10th centuries under successive dynasties along an old trade route.
                  </p>
                </div>
                <div style={{ padding: '20px 0', borderBottom: '1px solid var(--hair)' }}>
                  <div className="eyebrow" style={{ marginBottom: '8px' }}>Culture</div>
                  <p style={{ fontSize: '14px', color: 'var(--ink-2)', lineHeight: '1.6' }}>
                    A rare site where Buddhist, Hindu and Jain traditions sit side by side in dialogue.
                  </p>
                </div>
                <div style={{ padding: '20px 0' }}>
                  <div className="eyebrow" style={{ marginBottom: '8px' }}>Significance</div>
                  <p style={{ fontSize: '14px', color: 'var(--ink-2)', lineHeight: '1.6' }}>
                    A UNESCO World Heritage Site and one of the largest rock-cut monastic complexes on earth.
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '24px', marginTop: '28px' }}>
                <button className="btn-gold" onClick={() => guard('/experiences')}>Explore in AR</button>
                <a href="#" className="btn-outline">
                  Learn the History
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <img src="/img/hero-hampi.jpg" alt="India at dusk" />
        <div className="scrim"></div>
        <div className="container final-content">
          <h2>Your next story<br />is waiting.</h2>
          <div className="final-ctas">
            <button className="btn-gold" onClick={() => guard('/planner')}>Plan My Journey</button>
            <a href="#discovery" className="btn-ghost">Explore India</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="brand">
                <svg viewBox="0 0 40 40" fill="none" width="26" height="26">
                  <path d="M20 3 L27 13 L27 16 L13 16 L13 13 Z" fill="#B99550" />
                  <rect x="15" y="16" width="10" height="16" fill="none" stroke="#B99550" strokeWidth="1" />
                  <path d="M11 32 H29 V36 H11 Z" fill="#B99550" opacity="0.9" />
                </svg>
                <span className="brand-name" style={{ fontSize: '18px' }}>MICHIRA</span>
              </div>
              <p>Find your way.<br />Discover more.</p>
              <div className="footer-social">
                <a href="#" aria-label="Instagram">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" />
                  </svg>
                </a>
                <a href="#" aria-label="Facebook">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M15 8h-2a2 2 0 00-2 2v10M8 12h7" />
                  </svg>
                </a>
                <a href="#" aria-label="YouTube">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <rect x="3" y="6" width="18" height="12" rx="3" />
                    <path d="M10 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a href="#" aria-label="Twitter">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M22 4s-.7 2-2 3c1 6-4 11-10 11-3 0-5-1-7-3 3 0 5-1 6-2-2 0-4-2-4-4 1 0 2 0 2-.5C4 8 3 6 3 4c1.5 2 4 3 7 3-.5-3 2-5 4.5-4 1.3 0 2.3.5 3 1.4C19 4.2 20 4 22 4z" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="fcol">
              <h5>Explore</h5>
              <button className="fcol-link" onClick={() => guard('/explore')}>Destinations</button>
              <a href="#">Heritage Sites</a>
              <a href="#">Travel Guide</a>
              <a href="#">Hidden Gems</a>
              <a href="#">Maps</a>
            </div>
            <div className="fcol">
              <h5>Journeys</h5>
              <button className="fcol-link" onClick={() => guard('/planner')}>AI Planner</button>
              <a href="#">Itineraries</a>
              <a href="#">Custom Trips</a>
              <a href="#">Group Travel</a>
            </div>
            <div className="fcol">
              <h5>Heritage</h5>
              <a href="#">Architecture</a>
              <a href="#">History</a>
              <a href="#">Cultures</a>
              <a href="#">Timelines</a>
              <a href="#">AR Experiences</a>
            </div>
            <div className="fcol">
              <h5>Insights</h5>
              <button className="fcol-link" onClick={() => guard('/reviews')}>Traveler Reviews</button>
              <a href="#">Sentiment Insights</a>
              <a href="#">Travel Trends</a>
              <a href="#">Crowd Insights</a>
              <a href="#">Safety Insights</a>
            </div>
            <div className="fcol">
              <h5>Platform</h5>
              <button className="fcol-link" onClick={() => guard('/planner')}>AI Travel Planner</button>
              <button className="fcol-link" onClick={() => guard('/assistant')}>AI Guide</button>
              <button className="fcol-link" onClick={() => guard('/reviews')}>Review Intelligence</button>
              <a href="#">AR Heritage</a>
              <a href="#">Multilingual Support</a>
            </div>
            <div className="fcol">
              <h5>Company</h5>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Contact Us</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
          <div className="ornament-line">
            <svg width="200" height="14" viewBox="0 0 200 14">
              <line x1="0" y1="7" x2="80" y2="7" stroke="#B99550" strokeWidth="1" />
              <circle cx="100" cy="7" r="4" fill="none" stroke="#B99550" strokeWidth="1" />
              <line x1="120" y1="7" x2="200" y2="7" stroke="#B99550" strokeWidth="1" />
            </svg>
          </div>
          <div className="footer-bottom">
            <p>© 2026 MICHIRA. All rights reserved. | Smart India Hackathon 2026</p>
          </div>
        </div>
      </footer>

      {/* FLOATING AI ASSISTANT — removed, replaced by global MichiraGuide */}
    </div>
  );
};
