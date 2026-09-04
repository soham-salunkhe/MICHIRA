import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapPin, Search, ChevronDown, ChevronRight, Check, X, Sparkles } from 'lucide-react';
import { Destination } from '../services/api';

interface DestinationPickerProps {
  destinations: Destination[];
  selectedDestination: Destination | null;
  onSelect: (dest: Destination) => void;
}

const POPULAR_SLUGS = [
  'goa',
  'varanasi',
  'jaipur',
  'hampi',
  'kerala',
  'mumbai',
  'rishikesh',
  'amritsar',
  'bodh-gaya',
  'shrinagar',
  'srinagar',
  'darjeeling',
  'munnar',
  'madurai'
];

export const DestinationPicker: React.FC<DestinationPickerProps> = ({
  destinations,
  selectedDestination,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedStates, setExpandedStates] = useState<Record<string, boolean>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // The selected destination is passed directly as a prop — no local resolution needed
  const selectedDest = selectedDestination;

  // Group destinations by State / Union Territory
  const destinationsByState = useMemo(() => {
    const map: Record<string, Destination[]> = {};
    destinations.forEach((d) => {
      const state = d.state || 'Other';
      if (!map[state]) map[state] = [];
      map[state].push(d);
    });
    // Sort states alphabetically
    return Object.keys(map)
      .sort()
      .reduce((acc, key) => {
        acc[key] = map[key].sort((a, b) => a.name.localeCompare(b.name));
        return acc;
      }, {} as Record<string, Destination[]>);
  }, [destinations]);

  // Popular destinations list
  const popularDestinations = useMemo(() => {
    const list: Destination[] = [];
    POPULAR_SLUGS.forEach((slug) => {
      const found = destinations.find((d) => d.slug.toLowerCase() === slug.toLowerCase());
      if (found && !list.some((item) => item.id === found.id)) {
        list.push(found);
      }
    });
    if (list.length === 0 && destinations.length > 0) {
      return destinations.slice(0, 6);
    }
    return list;
  }, [destinations]);

  // Search results
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;

    return destinations.filter((d) => {
      const nameMatch = d.name.toLowerCase().includes(q);
      const stateMatch = d.state?.toLowerCase().includes(q);
      const descMatch = d.description?.toLowerCase().includes(q);
      return nameMatch || stateMatch || descMatch;
    });
  }, [destinations, searchQuery]);

  // Handle outside click & Esc key to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggleState = (stateName: string) => {
    setExpandedStates((prev) => ({ ...prev, [stateName]: !prev[stateName] }));
  };

  const handleSelect = (dest: Destination) => {
    onSelect(dest);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* ── Collapsed Selector Trigger ── */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#151716] border border-[#353A39] hover:border-[#B99550] text-[#F3EFE6] text-xs font-medium tracking-wide transition-all shadow-sm group cursor-pointer"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <MapPin className="w-3.5 h-3.5 text-[#D2A95D] group-hover:scale-110 transition-transform" />
        <span>
          <strong className="text-white font-serif text-sm mr-1">
            {selectedDest ? selectedDest.name : 'Select Destination'}
          </strong>
          <span className="text-[#777872] font-light">
            · {selectedDest ? selectedDest.state : 'All India'}
          </span>
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#B4B2AA] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#D2A95D]' : ''
          }`}
        />
      </button>

      {/* ── Searchable Popover Dropdown ── */}
      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 md:left-0 mt-2.5 w-[320px] sm:w-[380px] rounded-2xl bg-[#111313] border border-[#353A39] shadow-2xl shadow-black/80 z-50 overflow-hidden animate-fadeIn backdrop-blur-xl">
          {/* Search Input Box */}
          <div className="p-3 border-b border-[#353A39]/80 bg-[#151716]/60">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#B99550] absolute left-3 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across 28 states & 8 UTs..."
                className="w-full bg-[#0B0D0D] border border-[#353A39] rounded-xl pl-9 pr-8 py-2 text-xs text-[#F3EFE6] placeholder-[#777872] focus:outline-none focus:border-[#D2A95D] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-[#777872] hover:text-white p-0.5"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* List Content Container */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-[#353A39]/40 text-xs">
            {/* 1. SEARCH RESULTS VIEW */}
            {searchResults !== null ? (
              <div className="p-2 space-y-1">
                <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#D2A95D]">
                  Search Results ({searchResults.length})
                </div>
                {searchResults.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#777872]">
                    No destinations matching "{searchQuery}"
                  </div>
                ) : (
                  searchResults.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => handleSelect(d)}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                        d.id === selectedDestination?.id
                          ? 'bg-[#1E1B15] text-[#D2A95D] font-semibold'
                          : 'text-[#F3EFE6] hover:bg-[#181B1B] hover:text-white'
                      }`}
                    >
                      <div>
                        <div className="font-serif text-sm">{d.name}</div>
                        <div className="text-[10px] text-[#777872] font-light">{d.state}</div>
                      </div>
                      {d.id === selectedDestination?.id && (
                        <Check className="w-3.5 h-3.5 text-[#D2A95D]" />
                      )}
                    </button>
                  ))
                )}
              </div>
            ) : (
              /* 2. DEFAULT BROWSE VIEW: POPULAR + ALL STATES */
              <>
                {/* Popular Quick Section */}
                <div className="p-2.5 space-y-1 bg-[#151716]/30">
                  <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#D2A95D] flex items-center gap-1.5 font-serif">
                    <Sparkles className="w-3 h-3 text-[#D2A95D]" />
                    <span>Popular Destinations</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {popularDestinations.slice(0, 8).map((d) => (
                      <button
                        key={d.id}
                        onClick={() => handleSelect(d)}
                        className={`text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                          d.id === selectedDestination?.id
                            ? 'bg-[#1E1B15] text-[#D2A95D] font-semibold border border-[#B99550]/40'
                            : 'text-[#F3EFE6] hover:bg-[#181B1B]'
                        }`}
                      >
                        <span className="truncate">
                          <span className="font-serif font-medium">{d.name}</span>
                          <span className="text-[9px] text-[#777872] block truncate">{d.state}</span>
                        </span>
                        {d.id === selectedDestination?.id && (
                          <Check className="w-3 h-3 text-[#D2A95D] flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* All India by States & Union Territories */}
                <div className="p-2 space-y-0.5">
                  <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#777872]">
                    All India (28 States & 8 UTs)
                  </div>
                  {Object.entries(destinationsByState).map(([stateName, stateDests]) => {
                    const isExpanded = !!expandedStates[stateName];
                    const isStateActive = stateDests.some((d) => d.id === selectedDestination?.id);

                    return (
                      <div key={stateName} className="rounded-xl overflow-hidden">
                        {/* State Row */}
                        <button
                          type="button"
                          onClick={() => toggleState(stateName)}
                          className={`w-full text-left px-3 py-2 flex items-center justify-between rounded-lg transition-colors ${
                            isStateActive
                              ? 'bg-[#181B1B] text-[#D2A95D] font-semibold'
                              : 'text-[#B4B2AA] hover:bg-[#151716] hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-serif">{stateName}</span>
                            <span className="text-[10px] text-[#777872] font-mono">
                              ({stateDests.length})
                            </span>
                          </div>
                          <ChevronRight
                            className={`w-3.5 h-3.5 text-[#777872] transition-transform duration-200 ${
                              isExpanded ? 'rotate-90 text-[#D2A95D]' : ''
                            }`}
                          />
                        </button>

                        {/* Expanded Destinations within State */}
                        {isExpanded && (
                          <div className="pl-4 pr-1 py-1 space-y-0.5 bg-[#0B0D0D]/50 border-l border-[#353A39] ml-3 mb-1">
                            {stateDests.map((d) => (
                              <button
                                key={d.id}
                                onClick={() => handleSelect(d)}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition-colors ${
                                  d.id === selectedDestination?.id
                                    ? 'bg-[#1E1B15] text-[#D2A95D] font-semibold'
                                    : 'text-[#F3EFE6] hover:bg-[#151716] hover:text-white'
                                }`}
                              >
                                <span className="font-serif">{d.name}</span>
                                {d.id === selectedDestination?.id && (
                                  <Check className="w-3 h-3 text-[#D2A95D]" />
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
