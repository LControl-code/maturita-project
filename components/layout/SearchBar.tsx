import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

/**
 * A search bar component that displays a search input field with a search icon.
 * The component uses a form element containing an Input component with a search icon positioned absolutely.
 * 
 * @component
 * @returns A form element containing a search input field with a search icon
 * 
 * @example
 * ```tsx
 * <SearchBar />
 * ```
 */
export const SearchBar: React.FC = () => {
  return (
    <form className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
      <Input
        type="search"
        placeholder="Search..."
        className="pl-8 md:w-[300px] lg:w-[400px]"
      />
    </form>
  );
};