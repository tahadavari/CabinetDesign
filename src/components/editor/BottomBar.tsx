'use client';

import React from 'react';
import { useKitchenStore } from '@/stores/kitchenStore';
import {
  DOOR_STYLES,
  HANDLE_STYLES,
  CABINET_COLORS,
  COUNTERTOP_MATERIALS,
} from '@/lib/constants';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import type { DoorStyle, HandleStyle, CountertopMaterial } from '@/types/kitchen';

export default function BottomBar() {
  const globalStyle = useKitchenStore((s) => s.globalStyle);
  const updateGlobalStyle = useKitchenStore((s) => s.updateGlobalStyle);
  const applyGlobalStyleToAll = useKitchenStore((s) => s.applyGlobalStyleToAll);
  const countertop = useKitchenStore((s) => s.countertop);
  const updateCountertop = useKitchenStore((s) => s.updateCountertop);
  const lighting = useKitchenStore((s) => s.lighting);
  const updateLighting = useKitchenStore((s) => s.updateLighting);
  const cabinets = useKitchenStore((s) => s.cabinets);
  const appliances = useKitchenStore((s) => s.appliances);

  const handleDoorStyleChange = (style: DoorStyle) => {
    updateGlobalStyle({ cabinetDoorStyle: style });
  };

  const handleColorChange = (hex: string) => {
    updateGlobalStyle({ cabinetDoorColor: hex });
  };

  return (
    <div className="flex items-center gap-4 h-14 px-4 bg-card/80 backdrop-blur border-t border-border/50 overflow-x-auto">
      {/* Door Style */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs text-muted-foreground whitespace-nowrap">Door:</span>
        <div className="flex gap-1">
          {DOOR_STYLES.slice(0, 4).map((s) => (
            <button
              key={s.value}
              onClick={() => handleDoorStyleChange(s.value)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                globalStyle.cabinetDoorStyle === s.value
                  ? 'bg-copper-500/20 text-copper-400 border border-copper-500/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50 border border-transparent'
              }`}
            >
              {s.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Door Color */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs text-muted-foreground whitespace-nowrap">Color:</span>
        <div className="flex gap-1">
          {CABINET_COLORS.slice(0, 6).map((c) => (
            <button
              key={c.hex}
              onClick={() => handleColorChange(c.hex)}
              className={`w-6 h-6 rounded border-2 transition-all ${
                globalStyle.cabinetDoorColor === c.hex
                  ? 'border-copper-500 scale-110'
                  : 'border-transparent hover:border-border'
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
        </div>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Countertop Material */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs text-muted-foreground whitespace-nowrap">Counter:</span>
        <div className="flex gap-1">
          {COUNTERTOP_MATERIALS.slice(0, 5).map((m) => (
            <button
              key={m.value}
              onClick={() => {
                updateCountertop({ material: m.value, color: m.colors[0].hex });
              }}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                countertop.material === m.value
                  ? 'bg-copper-500/20 text-copper-400 border border-copper-500/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50 border border-transparent'
              }`}
            >
              {m.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Apply to All */}
      <button
        onClick={applyGlobalStyleToAll}
        className="px-3 py-1.5 text-xs rounded bg-copper-500/20 text-copper-400 border border-copper-500/30 hover:bg-copper-500/30 transition-colors whitespace-nowrap shrink-0"
      >
        Apply to All
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Time of day */}
      <div className="flex items-center gap-2 shrink-0 min-w-[140px]">
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {String(Math.floor(lighting.timeOfDay)).padStart(2, '0')}:00
        </span>
        <Slider
          value={[lighting.timeOfDay]}
          onValueChange={([v]) => updateLighting({ timeOfDay: v })}
          min={5}
          max={21}
          step={0.5}
          className="w-20"
        />
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Stats */}
      <div className="flex items-center gap-3 shrink-0 text-xs text-muted-foreground">
        <span>{cabinets.length} cabinets</span>
        <span>{appliances.length} appliances</span>
      </div>
    </div>
  );
}
