import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

const ConditionalLayout: React.FC<ConditionalLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Pages qui ont déjà leur propre padding (page d'accueil, landing pages)
  const pagesWithoutPadding = [
    '/',
    '/discover',
    '/about',
    '/contact'
  ];
  
  // Pages qui ont besoin du padding pour le header fixe
  const pagesWithPadding = [
    '/dashboard',
    '/profile',
    '/settings',
    '/admin',
    '/my-cagnottes',
    '/cagnottes',
    '/notifications',
    '/reports',
    '/kyc'
  ];
  
  // Déterminer si la page a besoin de padding
  const needsPadding = pagesWithPadding.some(path => location.pathname.startsWith(path));
  const isHomePage = location.pathname === '/';
  
  // Classes CSS conditionnelles
  const appContentClass = `app-content ${
    isHomePage ? 'home-page' : 
    needsPadding ? 'dashboard-page' : 
    'default-page'
  }`;
  
  return (
    <div className="app-container">
      <Header />
      <div className={appContentClass}>
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default ConditionalLayout;
