import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

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