'use client';

import React from 'react';
import type { LayoutType } from '@/types/kitchen';
import { cn } from '@/lib/utils';

interface LayoutCardProps {
  type: LayoutType;
  name: string;
  description: string;
  onClick: () => void;
}

function LayoutDiagram({ type }: { type: LayoutType }) {
  const baseClass = 'fill-copper-500/80 stroke-copper-600';
  const wallClass = 'fill-zinc-600 stroke-zinc-500';

  switch (type) {
    case 'I':
      return (
        <svg viewBox="0 0 120 100" className="w-full h-full">
          <rect x="10" y="10" width="100" height="8" className={wallClass} rx="1" />
          <rect x="15" y="18" width="90" height="20" className={baseClass} rx="2" />
          <rect x="15" y="18" width="90" height="2" className="fill-copper-300/50" />
        </svg>
      );
    case 'II':
      return (
        <svg viewBox="0 0 120 100" className="w-full h-full">
          <rect x="10" y="10" width="100" height="8" className={wallClass} rx="1" />
          <rect x="15" y="18" width="90" height="20" className={baseClass} rx="2" />
          <rect x="10" y="82" width="100" height="8" className={wallClass} rx="1" />
          <rect x="15" y="62" width="90" height="20" className={baseClass} rx="2" />
        </svg>
      );
    case 'L':
      return (
        <svg viewBox="0 0 120 100" className="w-full h-full">
          <rect x="10" y="10" width="100" height="8" className={wallClass} rx="1" />
          <rect x="10" y="10" width="8" height="80" className={wallClass} rx="1" />
          <rect x="15" y="18" width="90" height="20" className={baseClass} rx="2" />
          <rect x="18" y="18" width="20" height="65" className={baseClass} rx="2" />
        </svg>
      );
    case 'U':
      return (
        <svg viewBox="0 0 120 100" className="w-full h-full">
          <rect x="10" y="10" width="100" height="8" className={wallClass} rx="1" />
          <rect x="10" y="10" width="8" height="80" className={wallClass} rx="1" />
          <rect x="102" y="10" width="8" height="80" className={wallClass} rx="1" />
          <rect x="15" y="18" width="90" height="20" className={baseClass} rx="2" />
          <rect x="18" y="18" width="20" height="65" className={baseClass} rx="2" />
          <rect x="82" y="18" width="20" height="65" className={baseClass} rx="2" />
        </svg>
      );
    case 'G':
      return (
        <svg viewBox="0 0 120 100" className="w-full h-full">
          <rect x="10" y="10" width="100" height="8" className={wallClass} rx="1" />
          <rect x="10" y="10" width="8" height="80" className={wallClass} rx="1" />
          <rect x="102" y="10" width="8" height="80" className={wallClass} rx="1" />
          <rect x="15" y="18" width="90" height="20" className={baseClass} rx="2" />
          <rect x="18" y="18" width="20" height="65" className={baseClass} rx="2" />
          <rect x="82" y="18" width="20" height="65" className={baseClass} rx="2" />
          <rect x="60" y="72" width="42" height="16" className={baseClass} rx="2" />
        </svg>
      );
    case 'island':
      return (
        <svg viewBox="0 0 120 100" className="w-full h-full">
          <rect x="10" y="10" width="100" height="8" className={wallClass} rx="1" />
          <rect x="10" y="10" width="8" height="80" className={wallClass} rx="1" />
          <rect x="15" y="18" width="90" height="20" className={baseClass} rx="2" />
          <rect x="18" y="18" width="20" height="65" className={baseClass} rx="2" />
          <rect x="48" y="50" width="40" height="24" className="fill-copper-400/60 stroke-copper-500 stroke-[1.5]" rx="3" />
          <line x1="48" y1="62" x2="88" y2="62" className="stroke-copper-600/40" strokeWidth="0.5" />
        </svg>
      );
    case 'peninsula':
      return (
        <svg viewBox="0 0 120 100" className="w-full h-full">
          <rect x="10" y="10" width="100" height="8" className={wallClass} rx="1" />
          <rect x="10" y="10" width="8" height="80" className={wallClass} rx="1" />
          <rect x="15" y="18" width="90" height="20" className={baseClass} rx="2" />
          <rect x="18" y="18" width="20" height="65" className={baseClass} rx="2" />
          <rect x="38" y="65" width="45" height="18" className="fill-copper-400/60 stroke-copper-500 stroke-[1.5]" rx="2" />
        </svg>
      );
  }
}

export default function LayoutCard({ type, name, description, onClick }: LayoutCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative flex flex-col items-center p-6 rounded-xl border border-border/50',
        'bg-card/50 backdrop-blur-sm',
        'hover:border-copper-500/50 hover:bg-card/80 hover:shadow-lg hover:shadow-copper-500/5',
        'transition-all duration-300 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-500',
        'cursor-pointer'
      )}
    >
      <div className="w-full aspect-[6/5] mb-4 p-2 rounded-lg bg-zinc-900/50 border border-border/30 group-hover:border-copper-500/20 transition-colors">
        <LayoutDiagram type={type} />
      </div>
      <h3 className="text-lg font-semibold text-foreground group-hover:text-copper-400 transition-colors">
        {name}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground text-center leading-relaxed">
        {description}
      </p>
      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-copper-500/0 to-copper-500/0 group-hover:from-copper-500/5 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
    </button>
  );
}
