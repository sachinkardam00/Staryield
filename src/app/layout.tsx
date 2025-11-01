import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';
import { InstantNavigation } from '@/components/Navigation/InstantNavigation';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StarYield Finance - DEX Aggregator",
  description: "Navigate the Financial Cosmos with StarYield Staking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        
        {/* Aggressive prefetching for instant navigation */}
        <link rel="prefetch" href="/dashboard" />
        <link rel="prefetch" href="/referral" />
        <link rel="prefetch" href="/transaction" />
        <link rel="preload" href="/css/bootstrap.min.css" as="style" />
        <link rel="preload" href="/css/all.css" as="style" />
        <link rel="preload" href="/css/style.css" as="style" />
        <link rel="preload" href="/css/admin.css" as="style" />
        <link rel="preload" href="/js/jquery.js" as="script" />
        <link rel="preload" href="/js/bootstrap.bundle.js" as="script" />
        
        {/* Preload all pages for instant navigation */}
        <link rel="prefetch" href="/dashboard" />
        <link rel="prefetch" href="/referral" />
        <link rel="prefetch" href="/transaction" />
        
        {/* Load CSS files with optimized attributes */}
        <link rel="stylesheet" href="/css/bootstrap.min.css" media="all" />
        <link rel="stylesheet" href="/css/all.css" media="all" />
        <link rel="stylesheet" href="/css/style.css" media="all" />
        <link rel="stylesheet" href="/css/admin.css" media="all" />
        
        <link rel="shortcut icon" href="/images/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Fix wallet connection CORS issues */}
        <meta httpEquiv="Cross-Origin-Opener-Policy" content="same-origin-allow-popups" />
        <meta httpEquiv="Cross-Origin-Embedder-Policy" content="unsafe-none" />
      </head>
      <body className={inter.className}>
        <Providers>
          <InstantNavigation />
          {children}
        </Providers>
        
        {/* Load JS files synchronously for instant availability */}
        <script src="/js/jquery.js"></script>
        <script src="/js/bootstrap.bundle.js"></script>
        
        {/* Instant navigation script */}
        <script dangerouslySetInnerHTML={{
          __html: `
            // Instant page switching like vanilla JS
            document.addEventListener('DOMContentLoaded', function() {
              // Cache all pages
              const pages = ['/', '/dashboard', '/referral', '/transaction'];
              pages.forEach(page => {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = page;
                document.head.appendChild(link);
              });
              
              // Instant link handling
              document.addEventListener('click', function(e) {
                const link = e.target.closest('a[href^="/"]');
                if (link && !e.ctrlKey && !e.metaKey) {
                  const href = link.getAttribute('href');
                  if (href && href !== window.location.pathname) {
                    e.preventDefault();
                    
                    // Instant visual feedback
                    document.body.style.transition = 'opacity 0.05s';
                    document.body.style.opacity = '0.9';
                    
                    // Navigate instantly
                    window.location.href = href;
                  }
                }
              });
            });
          `
        }} />
      </body>
    </html>
  );
}