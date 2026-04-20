'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  defaultValue?: string;
  size?: 'sm' | 'lg';
  autoFocus?: boolean;
}

const Searchbar = ({ defaultValue = '', size = 'sm', autoFocus = false }: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchText, setSearchText] = useState<string>(defaultValue);
  const [suggest, setSuggest] = useState<string[]>([]);
  const router = useRouter();
  const [keywords] = useDebounce(searchText, 400);
  const [selected, setSelected] = useState<number>(-1);
  const [focused, setFocused] = useState(false);

  const clear = () => {
    setSearchText('');
    setSuggest([]);
    setSelected(-1);
    if (inputRef.current) inputRef.current.value = '';
  };

  useEffect(() => {
    const suggestion = async () => {
      const query = keywords.replaceAll(' ', '-');
      try {
        const res = await axios.get(`/api/blog/all?limit=5&sort=createdAt&fields=id,tags,title&search=${query}`);
        if (res.data.success) {
          const tags: string[] = [];
          const titles = res.data.data.map((val: { title: string; tags: string[] }) => {
            val.tags.forEach(t => tags.push(t));
            return val.title;
          });
          setSuggest(Array.from(new Set([...tags, ...titles])).slice(0, 6));
        }
      } catch (_) {}
    };
    if (keywords) suggestion();
    else setSuggest([]);
  }, [keywords]);

  const onSearch = (q?: string) => {
    const query = (q ?? inputRef.current?.value ?? '').replaceAll(' ', '+');
    if (!query) return;
    clear();
    router.push(`/search?keyword=${query}`);
  };

  const isLg = size === 'lg';

  return (
    <div className="relative w-full">
      <div className={`flex items-center gap-3 bg-white border ${focused ? 'border-[rgb(9,9,11)] ring-2 ring-[rgb(9,9,11)]/5' : 'border-gray-200'} transition-all ${isLg ? 'rounded-2xl px-5 py-4' : 'rounded-xl px-4 py-2.5'}`}>
        <Search className={`shrink-0 text-gray-400 ${isLg ? 'w-5 h-5' : 'w-4 h-4'}`} />
        <input
          ref={inputRef}
          name="search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown' && selected < suggest.length - 1) setSelected(s => s + 1);
            if (e.key === 'ArrowUp' && selected > 0) setSelected(s => s - 1);
            if (e.key === 'Enter' && searchText) onSearch();
            if (e.key === 'Escape') clear();
          }}
          type="text"
          placeholder={isLg ? 'Search articles, topics, tags...' : 'Search...'}
          autoFocus={autoFocus}
          className={`flex-1 bg-transparent outline-none text-[rgb(9,9,11)] placeholder:text-gray-300 ${isLg ? 'text-base' : 'text-sm'}`}
        />
        {searchText && (
          <button onClick={clear} className="shrink-0 text-gray-300 hover:text-gray-500 transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
        {isLg && (
          <button onClick={() => onSearch()} className="shrink-0 px-4 py-2 bg-[rgb(9,9,11)] text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors">
            Search
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {suggest.length > 0 && focused && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50">
          {suggest.map((item, i) => (
            <button
              key={i}
              onMouseDown={() => onSearch(item)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${i === selected ? 'bg-gray-50 text-[rgb(9,9,11)]' : 'text-[rgb(63,63,70)] hover:bg-gray-50'}`}
            >
              <Search className="w-3.5 h-3.5 text-gray-300 shrink-0" />
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Searchbar;
