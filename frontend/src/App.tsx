import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { ExplorePage } from './pages/ExplorePage';
import { DestinationPage } from './pages/DestinationPage';
import { ReviewIntelligencePage } from './pages/ReviewIntelligencePage';
import { PlannerPage } from './pages/PlannerPage';
import { AssistantPage } from './pages/AssistantPage';
import { ExperiencesPage } from './pages/ExperiencesPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { IntelligenceDashboard } from './pages/IntelligenceDashboard';

function AppRoutes() {
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '/intelligence';
  const isPlanner = location.pathname === '/planner';

  const routes = (
    <Routes>
      <Route path="/" element={<LandingPage />} />
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

  if (isHome) {
    return <div className="min-h-screen w-full bg-[#111313]">{routes}</div>;
  }

  if (isPlanner) {
    return (
      <div className="min-h-screen w-full bg-[#111313] flex flex-col">
        <Navbar />
        <main className="flex-1 w-full">{routes}</main>
        <div className="max-w-[1360px] w-full mx-auto px-6 sm:px-10 pb-10">
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="clay-main-wrapper flex flex-col items-center justify-start">
      <div className="w-full max-w-[1400px] clay-container p-4 sm:p-7 lg:p-10 flex flex-col relative overflow-hidden">
        <Navbar />
        <main className="mt-4 flex-1 w-full">{routes}</main>
        <Footer />
      </div>
    </div>
  );
}

export function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
