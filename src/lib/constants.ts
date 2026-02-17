import type {
  LayoutType,
  DoorStyle,
  HandleStyle,
  CountertopMaterial,
  Wall,
  CountertopConfig,
  LightingConfig,
  GlobalStyle,
} from '@/types/kitchen';

// --- Layout Definitions ---
export const LAYOUT_OPTIONS: {
  type: LayoutType;
  name: string;
  description: string;
  icon: string;
}[] = [
  {
    type: 'I',
    name: 'Single Wall',
    description: 'All cabinets along one wall. Best for small kitchens and open-plan spaces.',
    icon: 'I',
  },
  {
    type: 'II',
    name: 'Galley',
    description: 'Two parallel walls of cabinets. Efficient workflow for serious cooks.',
    icon: 'II',
  },
  {
    type: 'L',
    name: 'L-Shape',
    description: 'Cabinets along two perpendicular walls. Versatile and popular layout.',
    icon: 'L',
  },
  {
    type: 'U',
    name: 'U-Shape',
    description: 'Cabinets along three walls. Maximum storage and counter space.',
    icon: 'U',
  },
  {
    type: 'G',
    name: 'G-Shape',
    description: 'U-shape with a peninsula extension. Extra workspace and casual dining.',
    icon: 'G',
  },
  {
    type: 'island',
    name: 'Island',
    description: 'Any layout plus a freestanding island. The heart of a modern kitchen.',
    icon: '◻',
  },
  {
    type: 'peninsula',
    name: 'Peninsula',
    description: 'Layout with an attached peninsula. Defines space while keeping it open.',
    icon: 'P',
  },
];

// --- Default Room Dimensions (in cm) ---
export const DEFAULT_WALL_HEIGHT = 240;
export const DEFAULT_WALL_THICKNESS = 15;
export const WALL_MIN_LENGTH = 100;
export const WALL_MAX_LENGTH = 800;
export const WALL_MIN_HEIGHT = 200;
export const WALL_MAX_HEIGHT = 300;

// --- Cabinet Dimensions (in cm) ---
export const BASE_CABINET = {
  defaultHeight: 85,
  minHeight: 80,
  maxHeight: 95,
  defaultDepth: 60,
  minDepth: 55,
  maxDepth: 65,
  widths: [30, 40, 45, 50, 60, 80, 90, 100, 120],
  defaultWidth: 60,
  toeKickDefault: 10,
  toeKickMin: 8,
  toeKickMax: 12,
};

export const WALL_CABINET = {
  defaultHeight: 70,
  minHeight: 60,
  maxHeight: 90,
  defaultDepth: 35,
  minDepth: 30,
  maxDepth: 40,
  widths: [30, 40, 50, 60, 80, 90, 100],
  defaultWidth: 60,
  mountingHeightDefault: 145,
  mountingHeightMin: 140,
  mountingHeightMax: 160,
};

export const TALL_CABINET = {
  defaultHeight: 220,
  minHeight: 200,
  maxHeight: 240,
  defaultDepth: 60,
  widths: [40, 50, 60],
  defaultWidth: 60,
};

// --- Snap Grid ---
export const SNAP_INCREMENT = 5; // cm
export const SCALE_FACTOR = 0.01; // 1cm = 0.01 Three.js units

// --- Door Styles ---
export const DOOR_STYLES: { value: DoorStyle; label: string }[] = [
  { value: 'flat', label: 'Flat / Slab' },
  { value: 'shaker', label: 'Shaker' },
  { value: 'raised-panel', label: 'Raised Panel' },
  { value: 'glass', label: 'Glass Front' },
  { value: 'open', label: 'Open Shelf' },
];

// --- Handle Styles ---
export const HANDLE_STYLES: { value: HandleStyle; label: string }[] = [
  { value: 'bar', label: 'Bar Handle' },
  { value: 'knob', label: 'Knob' },
  { value: 'cup-pull', label: 'Cup Pull' },
  { value: 'handleless', label: 'Handleless' },
  { value: 'edge-pull', label: 'Edge Pull' },
];

// --- Cabinet Colors ---
export const CABINET_COLORS = [
  { name: 'White', hex: '#FAFAFA' },
  { name: 'Cream', hex: '#FFFDD0' },
  { name: 'Light Grey', hex: '#D1D5DB' },
  { name: 'Grey', hex: '#6B7280' },
  { name: 'Navy', hex: '#1E3A5F' },
  { name: 'Forest Green', hex: '#2D5A27' },
  { name: 'Walnut', hex: '#5C4033' },
  { name: 'Oak', hex: '#C89F6B' },
  { name: 'Black', hex: '#1A1A1A' },
  { name: 'Sage', hex: '#9CAF88' },
];

// --- Handle Colors ---
export const HANDLE_COLORS = [
  { name: 'Chrome', hex: '#C0C0C0' },
  { name: 'Brass', hex: '#C8956C' },
  { name: 'Matte Black', hex: '#2A2A2A' },
  { name: 'Copper', hex: '#B87333' },
  { name: 'Brushed Nickel', hex: '#A8A8A8' },
];

// --- Countertop Materials ---
export const COUNTERTOP_MATERIALS: {
  value: CountertopMaterial;
  label: string;
  colors: { name: string; hex: string }[];
}[] = [
  {
    value: 'granite',
    label: 'Granite',
    colors: [
      { name: 'Black Galaxy', hex: '#1a1a2e' },
      { name: 'Bianco', hex: '#e8e4de' },
      { name: 'Tan Brown', hex: '#8B6914' },
    ],
  },
  {
    value: 'marble',
    label: 'Marble',
    colors: [
      { name: 'Carrara White', hex: '#F0EDE8' },
      { name: 'Calacatta Gold', hex: '#F5F0E1' },
      { name: 'Nero Marquina', hex: '#1C1C1C' },
    ],
  },
  {
    value: 'quartz',
    label: 'Quartz',
    colors: [
      { name: 'Pure White', hex: '#FEFEFE' },
      { name: 'Concrete Grey', hex: '#9E9E9E' },
      { name: 'Charcoal', hex: '#3D3D3D' },
    ],
  },
  {
    value: 'butcher-block',
    label: 'Butcher Block',
    colors: [
      { name: 'Maple', hex: '#C8A96E' },
      { name: 'Walnut', hex: '#6B4226' },
      { name: 'Oak', hex: '#B8860B' },
    ],
  },
  {
    value: 'laminate',
    label: 'Laminate',
    colors: [
      { name: 'White', hex: '#F5F5F5' },
      { name: 'Black', hex: '#2C2C2C' },
      { name: 'Wood Effect', hex: '#A0784E' },
    ],
  },
  {
    value: 'concrete',
    label: 'Concrete',
    colors: [
      { name: 'Natural', hex: '#A9A9A9' },
      { name: 'Dark', hex: '#5A5A5A' },
      { name: 'Light', hex: '#C8C8C8' },
    ],
  },
  {
    value: 'stainless-steel',
    label: 'Stainless Steel',
    colors: [
      { name: 'Brushed', hex: '#B8B8B8' },
      { name: 'Polished', hex: '#D4D4D4' },
    ],
  },
];

// --- Default Configs ---
export const DEFAULT_COUNTERTOP: CountertopConfig = {
  material: 'quartz',
  color: '#FEFEFE',
  thickness: 3,
  edgeProfile: 'square',
  overhangFront: 3,
  overhangSides: 2,
  backsplashHeight: '10cm',
};

export const DEFAULT_LIGHTING: LightingConfig = {
  ambientIntensity: 0.6,
  underCabinetLights: true,
  pendantLights: 0,
  pendantStyle: 'modern',
  recessedLights: true,
  inCabinetLights: false,
  timeOfDay: 12,
};

export const DEFAULT_GLOBAL_STYLE: GlobalStyle = {
  cabinetDoorStyle: 'shaker',
  cabinetBodyColor: '#FAFAFA',
  cabinetDoorColor: '#FAFAFA',
  handleStyle: 'bar',
  handleColor: '#2A2A2A',
};

// --- Layout Wall Presets ---
export function getDefaultWalls(layout: LayoutType): Wall[] {
  const h = DEFAULT_WALL_HEIGHT;
  const t = DEFAULT_WALL_THICKNESS;

  switch (layout) {
    case 'I':
      return [
        { id: 'wall-back', length: 400, height: h, thickness: t, position: { x: 0, y: 0, z: -150 }, rotation: 0, hasWindow: false, hasDoor: false },
      ];
    case 'II':
      return [
        { id: 'wall-back', length: 400, height: h, thickness: t, position: { x: 0, y: 0, z: -150 }, rotation: 0, hasWindow: false, hasDoor: false },
        { id: 'wall-front', length: 400, height: h, thickness: t, position: { x: 0, y: 0, z: 150 }, rotation: Math.PI, hasWindow: false, hasDoor: false },
      ];
    case 'L':
      return [
        { id: 'wall-back', length: 400, height: h, thickness: t, position: { x: 0, y: 0, z: -150 }, rotation: 0, hasWindow: false, hasDoor: false },
        { id: 'wall-left', length: 300, height: h, thickness: t, position: { x: -200, y: 0, z: 0 }, rotation: Math.PI / 2, hasWindow: false, hasDoor: false },
      ];
    case 'U':
      return [
        { id: 'wall-back', length: 400, height: h, thickness: t, position: { x: 0, y: 0, z: -150 }, rotation: 0, hasWindow: false, hasDoor: false },
        { id: 'wall-left', length: 300, height: h, thickness: t, position: { x: -200, y: 0, z: 0 }, rotation: Math.PI / 2, hasWindow: false, hasDoor: false },
        { id: 'wall-right', length: 300, height: h, thickness: t, position: { x: 200, y: 0, z: 0 }, rotation: -Math.PI / 2, hasWindow: false, hasDoor: false },
      ];
    case 'G':
      return [
        { id: 'wall-back', length: 400, height: h, thickness: t, position: { x: 0, y: 0, z: -150 }, rotation: 0, hasWindow: false, hasDoor: false },
        { id: 'wall-left', length: 300, height: h, thickness: t, position: { x: -200, y: 0, z: 0 }, rotation: Math.PI / 2, hasWindow: false, hasDoor: false },
        { id: 'wall-right', length: 300, height: h, thickness: t, position: { x: 200, y: 0, z: 0 }, rotation: -Math.PI / 2, hasWindow: false, hasDoor: false },
        { id: 'wall-peninsula', length: 150, height: h, thickness: t, position: { x: 125, y: 0, z: 150 }, rotation: Math.PI, hasWindow: false, hasDoor: false },
      ];
    case 'island':
      return [
        { id: 'wall-back', length: 400, height: h, thickness: t, position: { x: 0, y: 0, z: -200 }, rotation: 0, hasWindow: false, hasDoor: false },
        { id: 'wall-left', length: 400, height: h, thickness: t, position: { x: -200, y: 0, z: 0 }, rotation: Math.PI / 2, hasWindow: false, hasDoor: false },
      ];
    case 'peninsula':
      return [
        { id: 'wall-back', length: 400, height: h, thickness: t, position: { x: 0, y: 0, z: -150 }, rotation: 0, hasWindow: false, hasDoor: false },
        { id: 'wall-left', length: 300, height: h, thickness: t, position: { x: -200, y: 0, z: 0 }, rotation: Math.PI / 2, hasWindow: false, hasDoor: false },
      ];
    default:
      return [
        { id: 'wall-back', length: 400, height: h, thickness: t, position: { x: 0, y: 0, z: -150 }, rotation: 0, hasWindow: false, hasDoor: false },
      ];
  }
}
