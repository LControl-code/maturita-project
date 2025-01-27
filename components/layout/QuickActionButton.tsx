// components/layout/QuickActionButton.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

/**
 * A button component for quick actions with a plus icon.
 * 
 * @component
 * @returns A ghost-styled button with a plus icon and screen reader text
 * @example
 * ```tsx
 * <QuickActionButton />
 * ```
 */
export const QuickActionButton: React.FC = () => {
  return (
    <Button size="icon" variant="ghost">
      <Plus className="h-4 w-4" />
      <span className="sr-only">Quick action</span>
    </Button>
  );
};