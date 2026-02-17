import type { BaseCabinetType, WallCabinetType, TallCabinetType } from '@/types/kitchen';
import { BASE_CABINET, WALL_CABINET, TALL_CABINET } from '@/lib/constants';

export interface CabinetPreset {
  type: BaseCabinetType | WallCabinetType | TallCabinetType;
  category: 'base' | 'wall' | 'tall';
  name: string;
  description: string;
  defaultWidth: number;
  defaultHeight: number;
  defaultDepth: number;
  icon: string;
}

export const BASE_CABINET_PRESETS: CabinetPreset[] = [
  {
    type: 'regular',
    category: 'base',
    name: 'Standard Cabinet',
    description: 'Single door base cabinet',
    defaultWidth: BASE_CABINET.defaultWidth,
    defaultHeight: BASE_CABINET.defaultHeight,
    defaultDepth: BASE_CABINET.defaultDepth,
    icon: '🗄',
  },
  {
    type: 'drawer-3',
    category: 'base',
    name: 'Drawer Unit',
    description: '3-drawer base cabinet',
    defaultWidth: 60,
    defaultHeight: BASE_CABINET.defaultHeight,
    defaultDepth: BASE_CABINET.defaultDepth,
    icon: '🗃',
  },
  {
    type: 'sink-base',
    category: 'base',
    name: 'Sink Base',
    description: 'Base cabinet for sink installation',
    defaultWidth: 80,
    defaultHeight: BASE_CABINET.defaultHeight,
    defaultDepth: BASE_CABINET.defaultDepth,
    icon: '🚰',
  },
  {
    type: 'corner-l',
    category: 'base',
    name: 'Corner Cabinet',
    description: 'L-shaped corner base cabinet',
    defaultWidth: 90,
    defaultHeight: BASE_CABINET.defaultHeight,
    defaultDepth: BASE_CABINET.defaultDepth,
    icon: '📐',
  },
  {
    type: 'pull-out',
    category: 'base',
    name: 'Pull-Out',
    description: 'Narrow pull-out cabinet',
    defaultWidth: 30,
    defaultHeight: BASE_CABINET.defaultHeight,
    defaultDepth: BASE_CABINET.defaultDepth,
    icon: '📏',
  },
  {
    type: 'trash',
    category: 'base',
    name: 'Trash/Recycling',
    description: 'Waste bin cabinet',
    defaultWidth: 40,
    defaultHeight: BASE_CABINET.defaultHeight,
    defaultDepth: BASE_CABINET.defaultDepth,
    icon: '🗑',
  },
];

export const WALL_CABINET_PRESETS: CabinetPreset[] = [
  {
    type: 'regular',
    category: 'wall',
    name: 'Standard Wall',
    description: 'Single door wall cabinet',
    defaultWidth: WALL_CABINET.defaultWidth,
    defaultHeight: WALL_CABINET.defaultHeight,
    defaultDepth: WALL_CABINET.defaultDepth,
    icon: '🗄',
  },
  {
    type: 'glass-door',
    category: 'wall',
    name: 'Glass Door',
    description: 'Wall cabinet with glass front',
    defaultWidth: 60,
    defaultHeight: WALL_CABINET.defaultHeight,
    defaultDepth: WALL_CABINET.defaultDepth,
    icon: '🪟',
  },
  {
    type: 'open-shelf',
    category: 'wall',
    name: 'Open Shelf',
    description: 'Open wall shelf',
    defaultWidth: 60,
    defaultHeight: 40,
    defaultDepth: 30,
    icon: '📚',
  },
  {
    type: 'range-hood-housing',
    category: 'wall',
    name: 'Range Hood Housing',
    description: 'Cabinet housing for range hood',
    defaultWidth: 60,
    defaultHeight: WALL_CABINET.defaultHeight,
    defaultDepth: WALL_CABINET.defaultDepth,
    icon: '🌬',
  },
];

export const TALL_CABINET_PRESETS: CabinetPreset[] = [
  {
    type: 'pantry',
    category: 'tall',
    name: 'Pantry',
    description: 'Full-height pantry storage',
    defaultWidth: TALL_CABINET.defaultWidth,
    defaultHeight: TALL_CABINET.defaultHeight,
    defaultDepth: TALL_CABINET.defaultDepth,
    icon: '🏗',
  },
  {
    type: 'oven-tower',
    category: 'tall',
    name: 'Oven Tower',
    description: 'Tall cabinet for built-in oven',
    defaultWidth: 60,
    defaultHeight: TALL_CABINET.defaultHeight,
    defaultDepth: TALL_CABINET.defaultDepth,
    icon: '🔥',
  },
  {
    type: 'fridge-housing',
    category: 'tall',
    name: 'Fridge Housing',
    description: 'Tall cabinet for built-in fridge',
    defaultWidth: 60,
    defaultHeight: TALL_CABINET.defaultHeight,
    defaultDepth: TALL_CABINET.defaultDepth,
    icon: '❄',
  },
];

export const ALL_CABINET_PRESETS = [
  ...BASE_CABINET_PRESETS,
  ...WALL_CABINET_PRESETS,
  ...TALL_CABINET_PRESETS,
];
