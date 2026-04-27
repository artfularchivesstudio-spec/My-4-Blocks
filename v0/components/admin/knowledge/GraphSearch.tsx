'use client';

/**
 * 🔍 The Graph Search - Cosmic Oracle of Queries ✨
 *
 * "Seek and ye shall find — across the constellations of wisdom,
 *  the oracle reveals paths from query to understanding.
 *  Type your quest and watch the stars align."
 *
 * - The Spellbinding Museum Director of Celestial Queries
 */

import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface GraphSearchProps {
  onSearch: (query: string) => void;
}

export default function GraphSearch({ onSearch }: GraphSearchProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search concepts, scenarios, lenses..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="pl-10 pr-10 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 w-64"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <Button
          type="submit"
          size="sm"
          variant="outline"
          disabled={!query}
          className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
        >
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* 💡 Search tips */}
      {isFocused && !query && (
        <div className="absolute top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg border shadow-lg p-3 z-50">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Search Tips:
          </p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Type concept names or IDs</li>
            <li>• Search highlights matching nodes</li>
            <li>• Click a node to show shortest path</li>
            <li>• Double-click to expand connections</li>
          </ul>
        </div>
      )}
    </form>
  );
}
