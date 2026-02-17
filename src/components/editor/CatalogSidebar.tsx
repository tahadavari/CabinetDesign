'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useKitchenStore } from '@/stores/kitchenStore';
import {
  BASE_CABINET_PRESETS,
  WALL_CABINET_PRESETS,
  TALL_CABINET_PRESETS,
  type CabinetPreset,
} from '@/data/cabinetPresets';
import { APPLIANCE_PRESETS, type AppliancePreset } from '@/data/appliancePresets';
import type { Cabinet, Appliance } from '@/types/kitchen';

function CabinetItem({ preset }: { preset: CabinetPreset }) {
  const addCabinet = useKitchenStore((s) => s.addCabinet);
  const globalStyle = useKitchenStore((s) => s.globalStyle);
  const walls = useKitchenStore((s) => s.walls);
  const cabinets = useKitchenStore((s) => s.cabinets);

  const handleAdd = () => {
    // Find placement position: next to existing cabinets or at wall start
    const sameTypeCabs = cabinets.filter((c) => c.category === preset.category);
    let xPos = 0;
    let zPos = -120; // Near back wall by default

    if (sameTypeCabs.length > 0) {
      const lastCab = sameTypeCabs[sameTypeCabs.length - 1];
      xPos = lastCab.position.x + lastCab.width / 2 + preset.defaultWidth / 2 + 2;
      zPos = lastCab.position.z;
    } else if (walls.length > 0) {
      const backWall = walls[0];
      xPos = -backWall.length / 2 + preset.defaultWidth / 2 + 10;
      zPos = backWall.position.z + backWall.thickness / 2 + preset.defaultDepth / 2;
    }

    const cabinet: Omit<Cabinet, 'id'> = {
      category: preset.category,
      type: preset.type,
      position: { x: xPos, y: 0, z: zPos },
      rotation: 0,
      width: preset.defaultWidth,
      height: preset.defaultHeight,
      depth: preset.defaultDepth,
      doorStyle: globalStyle.cabinetDoorStyle,
      doorColor: globalStyle.cabinetDoorColor,
      bodyColor: globalStyle.cabinetBodyColor,
      handleStyle: globalStyle.handleStyle,
      handleColor: globalStyle.handleColor,
      hingeSide: 'right',
      toeKickHeight: preset.category === 'base' ? 10 : undefined,
      mountingHeight: preset.category === 'wall' ? 145 : undefined,
    };

    addCabinet(cabinet);
  };

  return (
    <button
      onClick={handleAdd}
      className="flex items-center gap-3 w-full p-2.5 rounded-lg hover:bg-accent/50 transition-colors text-left group"
    >
      <div className="w-10 h-10 rounded-md bg-zinc-800 border border-border/50 flex items-center justify-center text-lg group-hover:border-copper-500/30 transition-colors">
        {preset.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{preset.name}</p>
        <p className="text-xs text-muted-foreground truncate">{preset.defaultWidth}x{preset.defaultDepth}x{preset.defaultHeight}cm</p>
      </div>
    </button>
  );
}

function ApplianceItem({ preset }: { preset: AppliancePreset }) {
  const addAppliance = useKitchenStore((s) => s.addAppliance);
  const walls = useKitchenStore((s) => s.walls);
  const appliances = useKitchenStore((s) => s.appliances);

  const handleAdd = () => {
    let xPos = 0;
    let zPos = -120;

    if (appliances.length > 0) {
      const last = appliances[appliances.length - 1];
      xPos = last.position.x + last.width / 2 + preset.defaultWidth / 2 + 5;
      zPos = last.position.z;
    } else if (walls.length > 0) {
      const backWall = walls[0];
      xPos = 0;
      zPos = backWall.position.z + backWall.thickness / 2 + preset.defaultDepth / 2;
    }

    const appliance: Omit<Appliance, 'id'> = {
      type: preset.type,
      position: { x: xPos, y: 0, z: zPos },
      rotation: 0,
      width: preset.defaultWidth,
      height: preset.defaultHeight,
      depth: preset.defaultDepth,
      color: preset.color,
    };

    addAppliance(appliance);
  };

  return (
    <button
      onClick={handleAdd}
      className="flex items-center gap-3 w-full p-2.5 rounded-lg hover:bg-accent/50 transition-colors text-left group"
    >
      <div className="w-10 h-10 rounded-md bg-zinc-800 border border-border/50 flex items-center justify-center group-hover:border-copper-500/30 transition-colors">
        <div className="w-5 h-5 rounded-sm" style={{ backgroundColor: preset.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{preset.name}</p>
        <p className="text-xs text-muted-foreground truncate">{preset.defaultWidth}x{preset.defaultDepth}x{preset.defaultHeight}cm</p>
      </div>
    </button>
  );
}

export default function CatalogSidebar() {
  const catalogOpen = useKitchenStore((s) => s.catalogOpen);
  const toggleCatalog = useKitchenStore((s) => s.toggleCatalog);

  return (
    <div className={`relative flex flex-col bg-card/80 backdrop-blur border-r border-border/50 transition-all duration-300 ${catalogOpen ? 'w-72' : 'w-0'}`}>
      {/* Toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-8 top-3 z-10 h-7 w-7 rounded-r-md rounded-l-none bg-card border border-l-0 border-border/50"
        onClick={toggleCatalog}
      >
        {catalogOpen ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
      </Button>

      {catalogOpen && (
        <>
          <div className="px-4 py-3 border-b border-border/50">
            <h2 className="text-sm font-semibold text-foreground">Catalog</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Click to add to scene</p>
          </div>

          <Tabs defaultValue="base" className="flex-1 flex flex-col">
            <TabsList className="mx-3 mt-2 grid grid-cols-4">
              <TabsTrigger value="base" className="text-xs">Base</TabsTrigger>
              <TabsTrigger value="wall" className="text-xs">Wall</TabsTrigger>
              <TabsTrigger value="tall" className="text-xs">Tall</TabsTrigger>
              <TabsTrigger value="appliances" className="text-xs">Appl.</TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1 px-3">
              <TabsContent value="base" className="mt-0 space-y-0.5">
                {BASE_CABINET_PRESETS.map((preset) => (
                  <CabinetItem key={preset.type} preset={preset} />
                ))}
              </TabsContent>

              <TabsContent value="wall" className="mt-0 space-y-0.5">
                {WALL_CABINET_PRESETS.map((preset) => (
                  <CabinetItem key={preset.type} preset={preset} />
                ))}
              </TabsContent>

              <TabsContent value="tall" className="mt-0 space-y-0.5">
                {TALL_CABINET_PRESETS.map((preset) => (
                  <CabinetItem key={preset.type} preset={preset} />
                ))}
              </TabsContent>

              <TabsContent value="appliances" className="mt-0 space-y-0.5">
                {APPLIANCE_PRESETS.map((preset) => (
                  <ApplianceItem key={preset.type} preset={preset} />
                ))}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </>
      )}
    </div>
  );
}
