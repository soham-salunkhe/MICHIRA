import React, { useState, useEffect, useRef } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MichiraGuide } from './components/MichiraGuide';
import { LandingPage } from './pages/LandingPage';
import { ExplorePage } from './pages/ExplorePage';
import { DestinationPage } from './pages/DestinationPage';
import { ReviewIntelligencePage } from './pages/ReviewIntelligencePage';
import { PlannerPage } from './pages/PlannerPage';
import { AssistantPage } from './pages/AssistantPage';
import { ExperiencesPage } from './pages/ExperiencesPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { IntelligenceDashboard } from './pages/IntelligenceDashboard';
import { SignUpPage } from './pages/SignUpPage';
import { LoginPage } from './pages/LoginPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

function AppRoutes() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isFullBleed = ['/signup', '/login', '/reset-password'].includes(location.pathname);
  const showGuide = !isFullBleed;

  const [showToast, setShowToast] = useState(false);
  const [showFab, setShowFab] = useState(false);

  useEffect(() => {
    if (!showGuide) {
      setShowToast(false);
      setShowFab(false);
      return;
    }

    const showTimer = setTimeout(() => setShowToast(true), 2700);
    const hideTimer = setTimeout(() => setShowToast(false), 7250);
    const fabTimer  = setTimeout(() => setShowFab(true),   7300);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(fabTimer);
    };
  }, [showGuide]);

  const routes = (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/destination/:slug" element={<DestinationPage />} />
      <Route path="/reviews" element={<ReviewIntelligencePage />} />
      <Route path="/intelligence" element={<IntelligenceDashboard />} />
      <Route path="/planner" element={<PlannerPage />} />
      <Route path="/assistant" element={<AssistantPage />} />
      <Route path="/experiences" element={<ExperiencesPage />} />
      <Route path="/admin" element={<AdminDashboardPage />} />
    </Routes>
  );

  if (isHome || isFullBleed) {
    return (
      <>
        <div className="min-h-screen w-full bg-[#0B0D0D]">{routes}</div>
        {showGuide && (
          <MichiraGuide
            showToast={showToast}
            showFab={showFab}
            onDismissToast={() => {
              setShowToast(false);
              setShowFab(true);
            }}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen w-full bg-[#0B0D0D] flex flex-col">
        <Navbar />
        <main className="flex-1 w-full">{routes}</main>
        <div className="w-full max-w-[1360px] mx-auto px-6 sm:px-10 pb-10">
          <Footer />
        </div>
      </div>
      {showGuide && (
        <MichiraGuide
          showToast={showToast}
          showFab={showFab}
          onDismissToast={() => {
            setShowToast(false);
            setShowFab(true);
          }}
        />
      )}
    </>
  );
}

export function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
