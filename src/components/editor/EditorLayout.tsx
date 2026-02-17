'use client';

import React, { useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useKitchenStore } from '@/stores/kitchenStore';
import Toolbar from './Toolbar';
import CatalogSidebar from './CatalogSidebar';
import PropertiesPanel from './PropertiesPanel';
import BottomBar from './BottomBar';

// Dynamic import for the 3D viewport (no SSR)
const Viewport = dynamic(() => import('./Viewport'), { ssr: false });

export default function EditorLayout() {
  const router = useRouter();
  const layoutType = useKitchenStore((s) => s.layoutType);
  const deleteSelected = useKitchenStore((s) => s.deleteSelected);
  const undo = useKitchenStore((s) => s.undo);
  const redo = useKitchenStore((s) => s.redo);
  const setSelectedId = useKitchenStore((s) => s.setSelectedId);
  const selectedId = useKitchenStore((s) => s.selectedId);
  const duplicateCabinet = useKitchenStore((s) => s.duplicateCabinet);
  const cabinets = useKitchenStore((s) => s.cabinets);
  const toggleGrid = useKitchenStore((s) => s.toggleGrid);
  const toggleMeasurements = useKitchenStore((s) => s.toggleMeasurements);
  const setViewMode = useKitchenStore((s) => s.setViewMode);
  const saveToLocalStorage = useKitchenStore((s) => s.saveToLocalStorage);

  // Redirect to layout selection if no layout chosen
  useEffect(() => {
    if (!layoutType) {
      // Try loading from localStorage first
      const loaded = useKitchenStore.getState().loadFromLocalStorage();
      if (!loaded) {
        router.push('/');
      }
    }
  }, [layoutType, router]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (layoutType) {
        saveToLocalStorage();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [layoutType, saveToLocalStorage]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Skip if typing in input
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    const ctrl = e.ctrlKey || e.metaKey;

    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      deleteSelected();
    } else if (ctrl && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      undo();
    } else if (ctrl && e.key === 'z' && e.shiftKey) {
      e.preventDefault();
      redo();
    } else if (ctrl && e.key === 'Z') {
      e.preventDefault();
      redo();
    } else if (ctrl && e.key === 'd') {
      e.preventDefault();
      if (selectedId) {
        const cab = cabinets.find((c) => c.id === selectedId);
        if (cab) duplicateCabinet(selectedId);
      }
    } else if (ctrl && e.key === 's') {
      e.preventDefault();
      saveToLocalStorage();
    } else if (e.key === 'Escape') {
      setSelectedId(null);
    } else if (e.key === 'g' && !ctrl) {
      toggleGrid();
    } else if (e.key === 'm' && !ctrl) {
      toggleMeasurements();
    } else if (e.key === 't' && !ctrl) {
      setViewMode({ type: 'top' });
    } else if (e.key === 'p' && !ctrl) {
      setViewMode({ type: 'perspective' });
    }
  }, [deleteSelected, undo, redo, setSelectedId, selectedId, cabinets, duplicateCabinet, toggleGrid, toggleMeasurements, setViewMode, saveToLocalStorage]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!layoutType) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Toolbar />
      <div className="flex-1 flex min-h-0">
        <CatalogSidebar />
        <div className="flex-1 min-w-0">
          <Viewport />
        </div>
        <PropertiesPanel />
      </div>
      <BottomBar />
    </div>
  );
}
