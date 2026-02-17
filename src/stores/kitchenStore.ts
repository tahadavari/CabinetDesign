import { create } from 'zustand';
import type {
  LayoutType,
  Wall,
  Cabinet,
  Appliance,
  CountertopConfig,
  IslandConfig,
  LightingConfig,
  GlobalStyle,
  DoorStyle,
  HandleStyle,
  CountertopMaterial,
  ViewMode,
} from '@/types/kitchen';
import {
  getDefaultWalls,
  DEFAULT_COUNTERTOP,
  DEFAULT_LIGHTING,
  DEFAULT_GLOBAL_STYLE,
} from '@/lib/constants';
import { generateId } from '@/lib/utils';

interface HistoryEntry {
  cabinets: Cabinet[];
  appliances: Appliance[];
  walls: Wall[];
  island: IslandConfig | null;
}

interface KitchenStore {
  // Layout
  layoutType: LayoutType | null;
  walls: Wall[];

  // Objects
  cabinets: Cabinet[];
  appliances: Appliance[];

  // Countertop
  countertop: CountertopConfig;

  // Island
  island: IslandConfig | null;

  // Global style
  globalStyle: GlobalStyle;

  // Lighting
  lighting: LightingConfig;

  // UI State
  selectedId: string | null;
  viewMode: ViewMode;
  showGrid: boolean;
  showMeasurements: boolean;
  showDimensions: boolean;
  catalogOpen: boolean;
  propertiesOpen: boolean;

  // History (undo/redo)
  history: HistoryEntry[];
  historyIndex: number;

  // Actions — Layout
  setLayoutType: (type: LayoutType) => void;

  // Actions — Walls
  updateWall: (id: string, updates: Partial<Wall>) => void;

  // Actions — Cabinets
  addCabinet: (cabinet: Omit<Cabinet, 'id'>) => string;
  updateCabinet: (id: string, updates: Partial<Cabinet>) => void;
  removeCabinet: (id: string) => void;
  duplicateCabinet: (id: string) => string | null;

  // Actions — Appliances
  addAppliance: (appliance: Omit<Appliance, 'id'>) => string;
  updateAppliance: (id: string, updates: Partial<Appliance>) => void;
  removeAppliance: (id: string) => void;

  // Actions — Countertop
  updateCountertop: (updates: Partial<CountertopConfig>) => void;

  // Actions — Island
  setIsland: (island: IslandConfig | null) => void;
  updateIsland: (updates: Partial<IslandConfig>) => void;

  // Actions — Global Style
  updateGlobalStyle: (updates: Partial<GlobalStyle>) => void;
  applyGlobalStyleToAll: () => void;

  // Actions — Lighting
  updateLighting: (updates: Partial<LightingConfig>) => void;

  // Actions — Selection
  setSelectedId: (id: string | null) => void;

  // Actions — UI
  setViewMode: (mode: ViewMode) => void;
  toggleGrid: () => void;
  toggleMeasurements: () => void;
  toggleCatalog: () => void;
  toggleProperties: () => void;

  // Actions — History
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;

  // Actions — Delete selected
  deleteSelected: () => void;

  // Actions — Project
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => boolean;
  exportProject: () => string;
  importProject: (json: string) => boolean;
  resetProject: () => void;
}

export const useKitchenStore = create<KitchenStore>((set, get) => ({
  // Initial state
  layoutType: null,
  walls: [],
  cabinets: [],
  appliances: [],
  countertop: { ...DEFAULT_COUNTERTOP },
  island: null,
  globalStyle: { ...DEFAULT_GLOBAL_STYLE },
  lighting: { ...DEFAULT_LIGHTING },
  selectedId: null,
  viewMode: { type: 'perspective' },
  showGrid: true,
  showMeasurements: true,
  showDimensions: false,
  catalogOpen: true,
  propertiesOpen: true,
  history: [],
  historyIndex: -1,

  // Layout
  setLayoutType: (type) => {
    const walls = getDefaultWalls(type);
    set({
      layoutType: type,
      walls,
      cabinets: [],
      appliances: [],
      island: type === 'island' ? {
        id: generateId(),
        position: { x: 0, y: 0, z: 50 },
        width: 120,
        length: 80,
        height: 85,
        cabinets: [],
        hasCountertop: true,
        overhangSides: { front: 30, back: 0, left: 0, right: 0 },
        hasSink: false,
        hasCooktop: false,
      } : null,
      selectedId: null,
      history: [],
      historyIndex: -1,
    });
  },

  // Walls
  updateWall: (id, updates) => {
    set((state) => ({
      walls: state.walls.map((w) =>
        w.id === id ? { ...w, ...updates } : w
      ),
    }));
  },

  // Cabinets
  addCabinet: (cabinet) => {
    const id = generateId();
    get().pushHistory();
    set((state) => ({
      cabinets: [...state.cabinets, { ...cabinet, id }],
      selectedId: id,
    }));
    return id;
  },

  updateCabinet: (id, updates) => {
    set((state) => ({
      cabinets: state.cabinets.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    }));
  },

  removeCabinet: (id) => {
    get().pushHistory();
    set((state) => ({
      cabinets: state.cabinets.filter((c) => c.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    }));
  },

  duplicateCabinet: (id) => {
    const state = get();
    const cabinet = state.cabinets.find((c) => c.id === id);
    if (!cabinet) return null;
    const newId = generateId();
    state.pushHistory();
    set((s) => ({
      cabinets: [
        ...s.cabinets,
        {
          ...cabinet,
          id: newId,
          position: {
            ...cabinet.position,
            x: cabinet.position.x + cabinet.width + 5,
          },
        },
      ],
      selectedId: newId,
    }));
    return newId;
  },

  // Appliances
  addAppliance: (appliance) => {
    const id = generateId();
    get().pushHistory();
    set((state) => ({
      appliances: [...state.appliances, { ...appliance, id }],
      selectedId: id,
    }));
    return id;
  },

  updateAppliance: (id, updates) => {
    set((state) => ({
      appliances: state.appliances.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    }));
  },

  removeAppliance: (id) => {
    get().pushHistory();
    set((state) => ({
      appliances: state.appliances.filter((a) => a.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    }));
  },

  // Countertop
  updateCountertop: (updates) => {
    set((state) => ({
      countertop: { ...state.countertop, ...updates },
    }));
  },

  // Island
  setIsland: (island) => set({ island }),

  updateIsland: (updates) => {
    set((state) => ({
      island: state.island ? { ...state.island, ...updates } : null,
    }));
  },

  // Global Style
  updateGlobalStyle: (updates) => {
    set((state) => ({
      globalStyle: { ...state.globalStyle, ...updates },
    }));
  },

  applyGlobalStyleToAll: () => {
    const { globalStyle } = get();
    set((state) => ({
      cabinets: state.cabinets.map((c) => ({
        ...c,
        doorStyle: globalStyle.cabinetDoorStyle,
        doorColor: globalStyle.cabinetDoorColor,
        bodyColor: globalStyle.cabinetBodyColor,
        handleStyle: globalStyle.handleStyle,
        handleColor: globalStyle.handleColor,
      })),
    }));
  },

  // Lighting
  updateLighting: (updates) => {
    set((state) => ({
      lighting: { ...state.lighting, ...updates },
    }));
  },

  // Selection
  setSelectedId: (id) => set({ selectedId: id }),

  // UI
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  toggleMeasurements: () => set((s) => ({ showMeasurements: !s.showMeasurements })),
  toggleCatalog: () => set((s) => ({ catalogOpen: !s.catalogOpen })),
  toggleProperties: () => set((s) => ({ propertiesOpen: !s.propertiesOpen })),

  // History
  pushHistory: () => {
    const state = get();
    const entry: HistoryEntry = {
      cabinets: JSON.parse(JSON.stringify(state.cabinets)),
      appliances: JSON.parse(JSON.stringify(state.appliances)),
      walls: JSON.parse(JSON.stringify(state.walls)),
      island: state.island ? JSON.parse(JSON.stringify(state.island)) : null,
    };
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(entry);
    if (newHistory.length > 50) newHistory.shift();
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < 0) return;
    const entry = history[historyIndex];
    set({
      cabinets: entry.cabinets,
      appliances: entry.appliances,
      walls: entry.walls,
      island: entry.island,
      historyIndex: historyIndex - 1,
      selectedId: null,
    });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const entry = history[historyIndex + 1];
    set({
      cabinets: entry.cabinets,
      appliances: entry.appliances,
      walls: entry.walls,
      island: entry.island,
      historyIndex: historyIndex + 1,
      selectedId: null,
    });
  },

  // Delete selected
  deleteSelected: () => {
    const { selectedId, cabinets, appliances } = get();
    if (!selectedId) return;
    if (cabinets.find((c) => c.id === selectedId)) {
      get().removeCabinet(selectedId);
    } else if (appliances.find((a) => a.id === selectedId)) {
      get().removeAppliance(selectedId);
    }
  },

  // Project save/load
  saveToLocalStorage: () => {
    const state = get();
    const project = {
      layoutType: state.layoutType,
      walls: state.walls,
      cabinets: state.cabinets,
      appliances: state.appliances,
      countertop: state.countertop,
      island: state.island,
      globalStyle: state.globalStyle,
      lighting: state.lighting,
    };
    localStorage.setItem('kitchen-project', JSON.stringify(project));
  },

  loadFromLocalStorage: () => {
    try {
      const data = localStorage.getItem('kitchen-project');
      if (!data) return false;
      const project = JSON.parse(data);
      set({
        layoutType: project.layoutType,
        walls: project.walls,
        cabinets: project.cabinets,
        appliances: project.appliances,
        countertop: project.countertop,
        island: project.island,
        globalStyle: project.globalStyle,
        lighting: project.lighting,
        selectedId: null,
        history: [],
        historyIndex: -1,
      });
      return true;
    } catch {
      return false;
    }
  },

  exportProject: () => {
    const state = get();
    return JSON.stringify({
      version: '1.0',
      layoutType: state.layoutType,
      walls: state.walls,
      cabinets: state.cabinets,
      appliances: state.appliances,
      countertop: state.countertop,
      island: state.island,
      globalStyle: state.globalStyle,
      lighting: state.lighting,
    }, null, 2);
  },

  importProject: (json) => {
    try {
      const project = JSON.parse(json);
      if (!project.layoutType || !project.walls) return false;
      set({
        layoutType: project.layoutType,
        walls: project.walls,
        cabinets: project.cabinets || [],
        appliances: project.appliances || [],
        countertop: project.countertop || DEFAULT_COUNTERTOP,
        island: project.island || null,
        globalStyle: project.globalStyle || DEFAULT_GLOBAL_STYLE,
        lighting: project.lighting || DEFAULT_LIGHTING,
        selectedId: null,
        history: [],
        historyIndex: -1,
      });
      return true;
    } catch {
      return false;
    }
  },

  resetProject: () => {
    set({
      layoutType: null,
      walls: [],
      cabinets: [],
      appliances: [],
      countertop: { ...DEFAULT_COUNTERTOP },
      island: null,
      globalStyle: { ...DEFAULT_GLOBAL_STYLE },
      lighting: { ...DEFAULT_LIGHTING },
      selectedId: null,
      viewMode: { type: 'perspective' },
      showGrid: true,
      showMeasurements: true,
      history: [],
      historyIndex: -1,
    });
  },
}));
