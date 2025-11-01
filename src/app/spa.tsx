'use client';

import { useState, useEffect } from 'react';
import { CustomConnectButton } from '@/components/UI/CustomConnectButton';

// Import all page components
import HomePage from './page';
import DashboardPage from './dashboard/page';
import ReferralPage from './referral/page';
import TransactionPage from './transaction/page';

type PageType = 'home' | 'dashboard' | 'referral' | 'transaction';

export default function SinglePageApp() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [isLoading, setIsLoading] = useState(false);

  // Fast page switching without Next.js routing overhead
  const switchPage = (page: PageType) => {
    if (page === currentPage) return;
    
    setIsLoading(true);
    // Immediate page switch - no server round trip
    setTimeout(() => {
      setCurrentPage(page);
      setIsLoading(false);
      // Update URL without page reload
      window.history.pushState({}, '', `/${page === 'home' ? '' : page}`);
    }, 0);
  };

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/') setCurrentPage('home');
      else if (path === '/dashboard') setCurrentPage('dashboard');
      else if (path === '/referral') setCurrentPage('referral');
      else if (path === '/transaction') setCurrentPage('transaction');
    };

    window.addEventListener('popstate', handlePopState);
    handlePopState(); // Set initial page

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const renderPage = () => {
    if (isLoading) return <div className="loading">Loading...</div>;
    
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'dashboard': return <DashboardPage />;
      case 'referral': return <ReferralPage />;
      case 'transaction': return <TransactionPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="spa-container">
      {/* Global Navigation */}
      <style jsx global>{`
        .spa-nav a { cursor: pointer; }
        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
          font-size: 18px;
        }
      `}</style>
      
      <div 
        className="spa-nav" 
        onClick={(e) => {
          const target = e.target as HTMLElement;
          const page = target.getAttribute('data-page') as PageType;
          if (page) {
            e.preventDefault();
            switchPage(page);
          }
        }}
      >
        {renderPage()}
      </div>
    </div>
  );
}