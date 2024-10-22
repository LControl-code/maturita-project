// components/layout/QuickActionButton.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

export const QuickActionButton: React.FC = () => {
  return (
    <Button size="icon" variant="ghost">
      <Plus className="h-4 w-4" />
      <span className="sr-only">Quick action</span>
    </Button>
  );
};