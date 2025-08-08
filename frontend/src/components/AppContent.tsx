import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BackToTopButton from './BackToTopButton';
import HomePage from './HomePage';
import OnlineStore from './OnlineStore';
import CoursesPage from './CoursesPage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import DeliveryPage from './DeliveryPage';
import TermsPage from '../pages/TermsPage';
import PrivacyPage from '../pages/PrivacyPage';
import NotFound from '../pages/NotFound';
import AdminDashboard from './AdminDashboard';
import AdminLogin from './AdminLogin';
import AdminGuard from './AdminGuard';
import TestSetup from './TestSetup';

const AppContent: React.FC = () => {
  // Aplicația afișează doar partea vizuală pentru toți utilizatorii
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/magazin" element={<OnlineStore />} />
          <Route path="/cursuri" element={<CoursesPage />} />
          <Route path="/despre" element={<AboutPage />} />
          <Route path="/livrare" element={<DeliveryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/termeni" element={<TermsPage />} />
          <Route path="/confidentialitate" element={<PrivacyPage />} />

          {/* Test Setup (for development) */}
          <Route path="/test-setup" element={<TestSetup />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <AdminDashboard />
              </AdminGuard>
            }
          />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default AppContent;
