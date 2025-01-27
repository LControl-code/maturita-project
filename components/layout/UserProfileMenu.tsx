// components/layout/UserProfileMenu.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserData } from '@/types/layout';

/**
 * A dropdown menu component for displaying user profile information and actions.
 * 
 * @component
 * @example
 * ```tsx
 * <UserProfileMenu />
 * ```
 * 
 * Renders a button with user's avatar that opens a dropdown menu containing:
 * - User's full name and email
 * - Profile navigation options
 * - Settings access
 * - Help section link
 * - Logout functionality
 * 
 * The component uses hardcoded user data and displays the user's initials as a fallback
 * if the avatar image fails to load.
 * 
 * @returns A dropdown menu interface for user profile interactions
 */
export const UserProfileMenu: React.FC = () => {
  const userData: UserData = {
    name: "Adam Stratilík",
    email: "adam.stratilik@student.ssnd.sk",
    avatarSrc: "/placeholder-avatar.jpg",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userData.avatarSrc} alt={userData.name} />
            <AvatarFallback>{userData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userData.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{userData.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Help</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};