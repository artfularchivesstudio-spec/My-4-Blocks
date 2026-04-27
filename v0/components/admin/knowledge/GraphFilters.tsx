'use client';

/**
 * 🎛️ The Graph Filters - Celestial Prism of Types ✨
 *
 * "Gaze through the prism and see the universe unfold —
 *  concepts, scenarios, lenses, rubrics, and sections,
 *  each a different color in the spectrum of knowledge."
 *
 * - The Spellbinding Museum Director of Cosmic Filters
 */

import React, { useState } from 'react';
import { Filter, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { NodeType } from './KnowledgeGraphView';

interface GraphFiltersProps {
  selectedTypes: Set<NodeType>;
  onFilterChange: (types: Set<NodeType>) => void;
}

const ALL_TYPES: NodeType[] = ['concept', 'scenario', 'lens', 'rubric', 'section'];

const TYPE_LABELS: Record<NodeType, { label: string; color: string; description: string }> = {
  concept: {
    label: 'Concepts',
    color: 'bg-blue-500',
    description: 'Emotional concepts and ideas',
  },
  scenario: {
    label: 'Scenarios',
    color: 'bg-green-500',
    description: 'Example scenarios and cases',
  },
  lens: {
    label: 'Lenses',
    color: 'bg-purple-500',
    description: 'Perspectives and viewpoints',
  },
  rubric: {
    label: 'Rubrics',
    color: 'bg-orange-500',
    description: 'Evaluation criteria',
  },
  section: {
    label: 'Sections',
    color: 'bg-red-500',
    description: 'Curriculum sections',
  },
};

export default function GraphFilters({ selectedTypes, onFilterChange }: GraphFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (type: NodeType) => {
    const newTypes = new Set(selectedTypes);
    if (newTypes.has(type)) {
      // Don't allow deselecting all types
      if (newTypes.size > 1) {
        newTypes.delete(type);
      }
    } else {
      newTypes.add(type);
    }
    onFilterChange(newTypes);
  };

  const handleSelectAll = () => {
    onFilterChange(new Set(ALL_TYPES));
  };

  const handleClearAll = () => {
    // Keep at least one type selected
    onFilterChange(new Set([ALL_TYPES[0]]));
  };

  const selectedCount = selectedTypes.size;
  const totalCount = ALL_TYPES.length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">
            Filters {selectedCount < totalCount && `(${selectedCount}/${totalCount})`}
          </span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-56 p-3" align="end">
        <div className="space-y-3">
          {/* 📊 Filter stats */}
          <div className="text-xs text-muted-foreground text-center pb-2 border-b">
            Showing {selectedCount} of {totalCount} types
          </div>

          {/* 🎨 Type checkboxes */}
          <div className="space-y-2">
            {ALL_TYPES.map((type) => {
              const info = TYPE_LABELS[type];
              const isSelected = selectedTypes.has(type);

              return (
                <button
                  key={type}
                  onClick={() => handleToggle(type)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className={`w-4 h-4 rounded ${info.color} flex-shrink-0`} />
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">{info.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {info.description}
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* 🎛️ Quick actions */}
          <div className="flex gap-2 pt-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
              className="flex-1 text-xs"
            >
              All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="flex-1 text-xs"
            >
              Clear
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
