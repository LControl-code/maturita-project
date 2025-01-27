import React from 'react';
import Link from 'next/link';

/**
 * A React component that renders the site logo with a linked title.
 * The logo consists of an SVG icon and text that is hidden on mobile devices.
 * When clicked, it navigates to the home page.
 * 
 * @returns A Link component containing the logo SVG and site title
 * @example
 * ```tsx
 * <SiteLogo />
 * ```
 */
export const SiteLogo: React.FC = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
      >
        <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
      </svg>
      <span className="font-semibold text-lg hidden md:inline-block">Industrial Test Data Analyser</span>
    </Link>
  );
};
