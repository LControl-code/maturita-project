import React from 'react';
import { MobileMenuToggle } from '@/components/layout/MobileMenuToggle';
import { SiteLogo } from '@/components/layout/SiteLogo';
import { DesktopNavLinks } from '@/components/layout/DesktopNavLinks';
import { SearchBar } from '@/components/layout/SearchBar';
import { QuickActionButton } from '@/components/layout/QuickActionButton';
import { UserProfileMenu } from '@/components/layout/UserProfileMenu';

/**
 * Main navigation bar component for the application.
 * Renders a header containing site logo, mobile menu toggle, desktop navigation links,
 * search functionality, quick action button, and user profile menu.
 * 
 * @component
 * @returns {JSX.Element} A header element containing navigation components
 */
export const MainNavbar: React.FC = () => {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 gap-4">
        <SiteLogo />
        <MobileMenuToggle />
        <DesktopNavLinks />
        <div className="ml-auto flex items-center gap-4">
          <SearchBar />
          <QuickActionButton />
          <UserProfileMenu />
        </div>
      </div>
    </header>
  );
};