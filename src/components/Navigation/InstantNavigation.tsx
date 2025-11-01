'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function InstantNavigation() {
  const router = useRouter();

  useEffect(() => {
    // Prefetch all pages immediately on app load
    const pages = ['/', '/dashboard', '/referral', '/transaction'];
    pages.forEach(page => {
      router.prefetch(page);
    });

    // Add instant navigation to all links
    const addInstantNavigation = () => {
      const links = document.querySelectorAll('a[href^="/"]');
      
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        // Prefetch on hover
        link.addEventListener('mouseenter', () => {
          router.prefetch(href);
        });

        // Instant navigation on click
        link.addEventListener('click', (e) => {
          e.preventDefault();
          
          // Show immediate visual feedback
          document.body.style.opacity = '0.8';
          
          // Navigate instantly
          router.push(href);
          
          // Restore opacity after a brief moment
          setTimeout(() => {
            document.body.style.opacity = '1';
          }, 50);
        });
      });
    };

    // Apply to existing links
    addInstantNavigation();

    // Apply to dynamically added links
    const observer = new MutationObserver(addInstantNavigation);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [router]);

  return null;
}