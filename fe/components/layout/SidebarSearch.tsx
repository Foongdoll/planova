'use client';

import { useState } from 'react';

interface SidebarSearchProps {
  onSearch: (query: string) => void;
}

export function SidebarSearch({ onSearch }: SidebarSearchProps) {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="rounded-lg border border-[#E7DDCB] bg-white px-2.5 py-1.5">
      <div className="flex items-center gap-1.5 text-xs text-neutral-600">
        <span className="text-neutral-400 text-[10px]">&#x2315;</span>
        <input
          className="w-full bg-transparent outline-none placeholder:text-neutral-400 text-xs"
          placeholder="검색"
          value={query}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
