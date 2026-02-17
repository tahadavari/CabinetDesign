'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LAYOUT_OPTIONS } from '@/lib/constants';
import { useKitchenStore } from '@/stores/kitchenStore';
import LayoutCard from './LayoutCard';
import type { LayoutType } from '@/types/kitchen';

export default function LayoutSelector() {
  const router = useRouter();
  const setLayoutType = useKitchenStore((s) => s.setLayoutType);

  const handleSelect = (type: LayoutType) => {
    setLayoutType(type);
    router.push('/editor');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-copper-500/10 border border-copper-500/20 text-copper-400 text-sm mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-copper-500 animate-pulse" />
            3D Kitchen Design Studio
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-foreground mb-4">
            Design Your Dream
            <span className="text-copper-500"> Kitchen</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Choose your kitchen layout to begin. Each layout can be fully customized
            with cabinets, appliances, countertops, and more in our interactive 3D editor.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {LAYOUT_OPTIONS.map((layout) => (
            <LayoutCard
              key={layout.type}
              type={layout.type}
              name={layout.name}
              description={layout.description}
              onClick={() => handleSelect(layout.type)}
            />
          ))}
        </div>

        {/* Footer hint */}
        <div className="text-center mt-16 text-sm text-muted-foreground">
          <p>You can change the layout anytime in the editor. All dimensions are fully customizable.</p>
        </div>
      </div>
    </div>
  );
}
