'use client';

import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight, Trash2, Copy, FlipHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useKitchenStore } from '@/stores/kitchenStore';
import {
  DOOR_STYLES,
  HANDLE_STYLES,
  CABINET_COLORS,
  HANDLE_COLORS,
  BASE_CABINET,
  WALL_CABINET,
  TALL_CABINET,
} from '@/lib/constants';
import type { Cabinet, Appliance, DoorStyle, HandleStyle } from '@/types/kitchen';

function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = 'cm',
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <span className="text-xs text-muted-foreground">{value}{unit}</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
}

function ColorSwatches({
  colors,
  value,
  onChange,
}: {
  colors: { name: string; hex: string }[];
  value: string;
  onChange: (hex: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {colors.map((c) => (
        <button
          key={c.hex}
          onClick={() => onChange(c.hex)}
          className={`w-7 h-7 rounded-md border-2 transition-all ${
            value === c.hex ? 'border-copper-500 scale-110' : 'border-transparent hover:border-border'
          }`}
          style={{ backgroundColor: c.hex }}
          title={c.name}
        />
      ))}
    </div>
  );
}

function CabinetProperties({ cabinet }: { cabinet: Cabinet }) {
  const updateCabinet = useKitchenStore((s) => s.updateCabinet);
  const removeCabinet = useKitchenStore((s) => s.removeCabinet);
  const duplicateCabinet = useKitchenStore((s) => s.duplicateCabinet);

  const dimConfig = cabinet.category === 'base' ? BASE_CABINET
    : cabinet.category === 'wall' ? WALL_CABINET
    : TALL_CABINET;

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex gap-1.5">
        <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => duplicateCabinet(cabinet.id)}>
          <Copy className="h-3.5 w-3.5 mr-1" /> Duplicate
        </Button>
        <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => updateCabinet(cabinet.id, { hingeSide: cabinet.hingeSide === 'left' ? 'right' : 'left' })}>
          <FlipHorizontal className="h-3.5 w-3.5 mr-1" /> Flip
        </Button>
        <Button variant="destructive" size="sm" className="text-xs" onClick={() => removeCabinet(cabinet.id)}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <Separator />

      {/* Dimensions */}
      <div>
        <h4 className="text-xs font-semibold text-foreground mb-2">Dimensions</h4>
        <div className="space-y-3">
          <NumberInput
            label="Width"
            value={cabinet.width}
            onChange={(v) => updateCabinet(cabinet.id, { width: v })}
            min={30}
            max={120}
            step={5}
          />
          <NumberInput
            label="Height"
            value={cabinet.height}
            onChange={(v) => updateCabinet(cabinet.id, { height: v })}
            min={dimConfig.minHeight}
            max={dimConfig.maxHeight}
            step={5}
          />
          <NumberInput
            label="Depth"
            value={cabinet.depth}
            onChange={(v) => updateCabinet(cabinet.id, { depth: v })}
            min={'minDepth' in dimConfig ? (dimConfig as { minDepth: number }).minDepth : 55}
            max={'maxDepth' in dimConfig ? (dimConfig as { maxDepth: number }).maxDepth : 65}
            step={5}
          />
          {cabinet.category === 'base' && cabinet.toeKickHeight !== undefined && (
            <NumberInput
              label="Toe Kick"
              value={cabinet.toeKickHeight}
              onChange={(v) => updateCabinet(cabinet.id, { toeKickHeight: v })}
              min={8}
              max={12}
            />
          )}
          {cabinet.category === 'wall' && cabinet.mountingHeight !== undefined && (
            <NumberInput
              label="Mounting Height"
              value={cabinet.mountingHeight}
              onChange={(v) => updateCabinet(cabinet.id, { mountingHeight: v })}
              min={140}
              max={160}
              step={5}
            />
          )}
        </div>
      </div>

      <Separator />

      {/* Position */}
      <div>
        <h4 className="text-xs font-semibold text-foreground mb-2">Position</h4>
        <div className="space-y-3">
          <NumberInput
            label="X Position"
            value={Math.round(cabinet.position.x)}
            onChange={(v) => updateCabinet(cabinet.id, { position: { ...cabinet.position, x: v } })}
            min={-400}
            max={400}
            step={5}
          />
          <NumberInput
            label="Z Position"
            value={Math.round(cabinet.position.z)}
            onChange={(v) => updateCabinet(cabinet.id, { position: { ...cabinet.position, z: v } })}
            min={-400}
            max={400}
            step={5}
          />
        </div>
      </div>

      <Separator />

      {/* Door Style */}
      <div>
        <h4 className="text-xs font-semibold text-foreground mb-2">Door Style</h4>
        <Select
          value={cabinet.doorStyle}
          onValueChange={(v) => updateCabinet(cabinet.id, { doorStyle: v as DoorStyle })}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DOOR_STYLES.map((s) => (
              <SelectItem key={s.value} value={s.value} className="text-xs">
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Door Color */}
      <div>
        <h4 className="text-xs font-semibold text-foreground mb-2">Door Color</h4>
        <ColorSwatches
          colors={CABINET_COLORS}
          value={cabinet.doorColor}
          onChange={(hex) => updateCabinet(cabinet.id, { doorColor: hex })}
        />
      </div>

      {/* Body Color */}
      <div>
        <h4 className="text-xs font-semibold text-foreground mb-2">Body Color</h4>
        <ColorSwatches
          colors={CABINET_COLORS}
          value={cabinet.bodyColor}
          onChange={(hex) => updateCabinet(cabinet.id, { bodyColor: hex })}
        />
      </div>

      <Separator />

      {/* Handle */}
      <div>
        <h4 className="text-xs font-semibold text-foreground mb-2">Handle Style</h4>
        <Select
          value={cabinet.handleStyle}
          onValueChange={(v) => updateCabinet(cabinet.id, { handleStyle: v as HandleStyle })}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {HANDLE_STYLES.map((s) => (
              <SelectItem key={s.value} value={s.value} className="text-xs">
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-foreground mb-2">Handle Color</h4>
        <ColorSwatches
          colors={HANDLE_COLORS}
          value={cabinet.handleColor}
          onChange={(hex) => updateCabinet(cabinet.id, { handleColor: hex })}
        />
      </div>
    </div>
  );
}

function ApplianceProperties({ appliance }: { appliance: Appliance }) {
  const updateAppliance = useKitchenStore((s) => s.updateAppliance);
  const removeAppliance = useKitchenStore((s) => s.removeAppliance);

  return (
    <div className="space-y-4">
      <Button variant="destructive" size="sm" className="w-full text-xs" onClick={() => removeAppliance(appliance.id)}>
        <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove Appliance
      </Button>

      <Separator />

      <div>
        <h4 className="text-xs font-semibold text-foreground mb-2">Dimensions</h4>
        <div className="space-y-3">
          <NumberInput
            label="Width"
            value={appliance.width}
            onChange={(v) => updateAppliance(appliance.id, { width: v })}
            min={30}
            max={120}
            step={5}
          />
          <NumberInput
            label="Height"
            value={appliance.height}
            onChange={(v) => updateAppliance(appliance.id, { height: v })}
            min={20}
            max={220}
            step={5}
          />
          <NumberInput
            label="Depth"
            value={appliance.depth}
            onChange={(v) => updateAppliance(appliance.id, { depth: v })}
            min={30}
            max={70}
            step={5}
          />
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-xs font-semibold text-foreground mb-2">Position</h4>
        <div className="space-y-3">
          <NumberInput
            label="X Position"
            value={Math.round(appliance.position.x)}
            onChange={(v) => updateAppliance(appliance.id, { position: { ...appliance.position, x: v } })}
            min={-400}
            max={400}
            step={5}
          />
          <NumberInput
            label="Z Position"
            value={Math.round(appliance.position.z)}
            onChange={(v) => updateAppliance(appliance.id, { position: { ...appliance.position, z: v } })}
            min={-400}
            max={400}
            step={5}
          />
        </div>
      </div>
    </div>
  );
}

function IslandProperties() {
  const island = useKitchenStore((s) => s.island);
  const updateIsland = useKitchenStore((s) => s.updateIsland);
  const setIsland = useKitchenStore((s) => s.setIsland);

  if (!island) return null;

  return (
    <div className="space-y-4">
      <Button variant="destructive" size="sm" className="w-full text-xs" onClick={() => setIsland(null)}>
        <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove Island
      </Button>

      <Separator />

      <div>
        <h4 className="text-xs font-semibold text-foreground mb-2">Island Dimensions</h4>
        <div className="space-y-3">
          <NumberInput label="Width" value={island.width} onChange={(v) => updateIsland({ width: v })} min={60} max={300} step={10} />
          <NumberInput label="Length" value={island.length} onChange={(v) => updateIsland({ length: v })} min={60} max={200} step={10} />
          <NumberInput label="Height" value={island.height} onChange={(v) => updateIsland({ height: v })} min={80} max={95} step={5} />
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-xs font-semibold text-foreground mb-2">Countertop Overhang</h4>
        <div className="space-y-3">
          <NumberInput label="Front" value={island.overhangSides.front} onChange={(v) => updateIsland({ overhangSides: { ...island.overhangSides, front: v } })} min={0} max={45} step={5} />
          <NumberInput label="Back" value={island.overhangSides.back} onChange={(v) => updateIsland({ overhangSides: { ...island.overhangSides, back: v } })} min={0} max={45} step={5} />
          <NumberInput label="Left" value={island.overhangSides.left} onChange={(v) => updateIsland({ overhangSides: { ...island.overhangSides, left: v } })} min={0} max={45} step={5} />
          <NumberInput label="Right" value={island.overhangSides.right} onChange={(v) => updateIsland({ overhangSides: { ...island.overhangSides, right: v } })} min={0} max={45} step={5} />
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-xs font-semibold text-foreground mb-2">Position</h4>
        <div className="space-y-3">
          <NumberInput label="X" value={Math.round(island.position.x)} onChange={(v) => updateIsland({ position: { ...island.position, x: v } })} min={-300} max={300} step={5} />
          <NumberInput label="Z" value={Math.round(island.position.z)} onChange={(v) => updateIsland({ position: { ...island.position, z: v } })} min={-300} max={300} step={5} />
        </div>
      </div>
    </div>
  );
}

export default function PropertiesPanel() {
  const propertiesOpen = useKitchenStore((s) => s.propertiesOpen);
  const toggleProperties = useKitchenStore((s) => s.toggleProperties);
  const selectedId = useKitchenStore((s) => s.selectedId);
  const cabinets = useKitchenStore((s) => s.cabinets);
  const appliances = useKitchenStore((s) => s.appliances);
  const island = useKitchenStore((s) => s.island);

  const selectedCabinet = useMemo(
    () => cabinets.find((c) => c.id === selectedId),
    [cabinets, selectedId]
  );

  const selectedAppliance = useMemo(
    () => appliances.find((a) => a.id === selectedId),
    [appliances, selectedId]
  );

  const isIslandSelected = island?.id === selectedId;

  const hasSelection = selectedCabinet || selectedAppliance || isIslandSelected;

  return (
    <div className={`relative flex flex-col bg-card/80 backdrop-blur border-l border-border/50 transition-all duration-300 ${propertiesOpen ? 'w-72' : 'w-0'}`}>
      {/* Toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -left-8 top-3 z-10 h-7 w-7 rounded-l-md rounded-r-none bg-card border border-r-0 border-border/50"
        onClick={toggleProperties}
      >
        {propertiesOpen ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
      </Button>

      {propertiesOpen && (
        <>
          <div className="px-4 py-3 border-b border-border/50">
            <h2 className="text-sm font-semibold text-foreground">Properties</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {hasSelection
                ? selectedCabinet ? `${selectedCabinet.category} cabinet` : selectedAppliance ? selectedAppliance.type : 'Island'
                : 'Select an object'
              }
            </p>
          </div>

          <ScrollArea className="flex-1 px-4 py-3">
            {!hasSelection && (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  Click on a cabinet or appliance in the 3D view to edit its properties.
                </p>
              </div>
            )}

            {selectedCabinet && <CabinetProperties cabinet={selectedCabinet} />}
            {selectedAppliance && <ApplianceProperties appliance={selectedAppliance} />}
            {isIslandSelected && <IslandProperties />}
          </ScrollArea>
        </>
      )}
    </div>
  );
}
