'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { startTransition } from 'react';

interface FastLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onMouseEnter?: () => void;
}

export function FastLink({ href, children, className, onMouseEnter }: FastLinkProps) {
  const router = useRouter();

  const handleMouseEnter = () => {
    // Prefetch on hover for instant loading
    router.prefetch(href);
    onMouseEnter?.();
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Use startTransition for non-blocking navigation
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <Link
      href={href}
      className={className}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      prefetch={true}
    >
      {children}
    </Link>
  );
}