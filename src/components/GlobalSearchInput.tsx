import React, { useState, ChangeEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

interface GlobalSearchInputProps {
  onSearchChange?: (searchTerm: string) => void;
  placeholder?: string;
  className?: string;
  initialValue?: string;
}

const GlobalSearchInput: React.FC<GlobalSearchInputProps> = ({
  onSearchChange,
  placeholder = "Search transactions, payees, help...",
  className = '',
  initialValue = '',
}) => {
  const [searchTerm, setSearchTerm] = useState<string>(initialValue);

  console.log('GlobalSearchInput loaded');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    if (onSearchChange) {
      onSearchChange(newSearchTerm);
    }
  };

  return (
    <div className={`relative flex items-center w-full max-w-md ${className}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        className="pl-10 pr-4 py-2 w-full border-input bg-background hover:bg-accent focus-visible:ring-ring focus-visible:ring-offset-background"
        aria-label="Global search input"
      />
    </div>
  );
};

export default GlobalSearchInput;