'use client';

import React, { useCallback } from 'react';
import {
  Undo2,
  Redo2,
  Eye,
  ArrowUp,
  ArrowRight,
  Box,
  Grid3X3,
  Ruler,
  Camera,
  Maximize,
  Save,
  Upload,
  Download,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { useKitchenStore } from '@/stores/kitchenStore';

function ToolbarButton({
  icon: Icon,
  label,
  shortcut,
  onClick,
  active,
  disabled,
}: {
  icon: React.ElementType;
  label: string;
  shortcut?: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={active ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={onClick}
            disabled={disabled}
          >
            <Icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-xs">
            {label}
            {shortcut && <span className="ml-2 text-muted-foreground">{shortcut}</span>}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function Toolbar() {
  const undo = useKitchenStore((s) => s.undo);
  const redo = useKitchenStore((s) => s.redo);
  const historyIndex = useKitchenStore((s) => s.historyIndex);
  const historyLength = useKitchenStore((s) => s.history.length);
  const viewMode = useKitchenStore((s) => s.viewMode);
  const setViewMode = useKitchenStore((s) => s.setViewMode);
  const showGrid = useKitchenStore((s) => s.showGrid);
  const toggleGrid = useKitchenStore((s) => s.toggleGrid);
  const showMeasurements = useKitchenStore((s) => s.showMeasurements);
  const toggleMeasurements = useKitchenStore((s) => s.toggleMeasurements);
  const saveToLocalStorage = useKitchenStore((s) => s.saveToLocalStorage);
  const exportProject = useKitchenStore((s) => s.exportProject);
  const importProject = useKitchenStore((s) => s.importProject);
  const resetProject = useKitchenStore((s) => s.resetProject);

  const handleExport = useCallback(() => {
    const json = exportProject();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kitchen-design.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [exportProject]);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        importProject(text);
      };
      reader.readAsText(file);
    };
    input.click();
  }, [importProject]);

  const handleScreenshot = useCallback(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'kitchen-screenshot.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  return (
    <div className="flex items-center gap-1 h-12 px-3 bg-card/80 backdrop-blur border-b border-border/50">
      {/* Logo / Back */}
      <div className="flex items-center gap-2 mr-3">
        <button
          onClick={resetProject}
          className="text-sm font-semibold text-copper-500 hover:text-copper-400 transition-colors"
        >
          Cabinet Studio
        </button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Undo / Redo */}
      <div className="flex items-center gap-0.5 mx-1">
        <ToolbarButton
          icon={Undo2}
          label="Undo"
          shortcut="Ctrl+Z"
          onClick={undo}
          disabled={historyIndex < 0}
        />
        <ToolbarButton
          icon={Redo2}
          label="Redo"
          shortcut="Ctrl+Shift+Z"
          onClick={redo}
          disabled={historyIndex >= historyLength - 1}
        />
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* View modes */}
      <div className="flex items-center gap-0.5 mx-1">
        <ToolbarButton
          icon={Box}
          label="Perspective"
          shortcut="P"
          onClick={() => setViewMode({ type: 'perspective' })}
          active={viewMode.type === 'perspective'}
        />
        <ToolbarButton
          icon={ArrowUp}
          label="Top View"
          shortcut="T"
          onClick={() => setViewMode({ type: 'top' })}
          active={viewMode.type === 'top'}
        />
        <ToolbarButton
          icon={Eye}
          label="Front View"
          onClick={() => setViewMode({ type: 'front' })}
          active={viewMode.type === 'front'}
        />
        <ToolbarButton
          icon={ArrowRight}
          label="Side View"
          onClick={() => setViewMode({ type: 'side' })}
          active={viewMode.type === 'side'}
        />
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Toggles */}
      <div className="flex items-center gap-0.5 mx-1">
        <ToolbarButton
          icon={Grid3X3}
          label="Toggle Grid"
          shortcut="G"
          onClick={toggleGrid}
          active={showGrid}
        />
        <ToolbarButton
          icon={Ruler}
          label="Toggle Measurements"
          shortcut="M"
          onClick={toggleMeasurements}
          active={showMeasurements}
        />
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Screenshot */}
      <ToolbarButton
        icon={Camera}
        label="Screenshot"
        onClick={handleScreenshot}
      />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Save / Load */}
      <div className="flex items-center gap-0.5">
        <ToolbarButton
          icon={Save}
          label="Save"
          shortcut="Ctrl+S"
          onClick={saveToLocalStorage}
        />
        <ToolbarButton
          icon={Download}
          label="Export JSON"
          onClick={handleExport}
        />
        <ToolbarButton
          icon={Upload}
          label="Import JSON"
          onClick={handleImport}
        />
      </div>
    </div>
  );
}
