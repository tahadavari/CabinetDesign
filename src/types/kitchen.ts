export type LayoutType = 'L' | 'U' | 'G' | 'I' | 'II' | 'island' | 'peninsula';

export type DoorStyle = 'flat' | 'shaker' | 'raised-panel' | 'glass' | 'open';

export type HandleStyle = 'bar' | 'knob' | 'cup-pull' | 'handleless' | 'edge-pull';

export type HandleMaterial = 'chrome' | 'brass' | 'matte-black' | 'copper' | 'brushed-nickel';

export type CountertopMaterial = 'granite' | 'marble' | 'quartz' | 'butcher-block' | 'laminate' | 'concrete' | 'stainless-steel';

export type EdgeProfile = 'square' | 'beveled' | 'bullnose' | 'ogee' | 'waterfall';

export type BacksplashHeight = 'none' | '10cm' | '15cm' | 'full';

export type CabinetCategory = 'base' | 'wall' | 'tall';

export type BaseCabinetType =
  | 'regular'
  | 'drawer-2'
  | 'drawer-3'
  | 'drawer-4'
  | 'corner-l'
  | 'corner-lazy-susan'
  | 'sink-base'
  | 'oven-housing'
  | 'pull-out'
  | 'trash';

export type WallCabinetType =
  | 'regular'
  | 'glass-door'
  | 'open-shelf'
  | 'corner'
  | 'range-hood-housing'
  | 'microwave-shelf'
  | 'lift-up';

export type TallCabinetType =
  | 'pantry'
  | 'oven-tower'
  | 'fridge-housing'
  | 'broom-closet';

export type ApplianceType =
  | 'refrigerator'
  | 'range-4'
  | 'range-5'
  | 'built-in-oven'
  | 'microwave'
  | 'dishwasher'
  | 'washing-machine'
  | 'sink-single'
  | 'sink-double'
  | 'range-hood-wall'
  | 'range-hood-integrated';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Wall {
  id: string;
  length: number;
  height: number;
  thickness: number;
  position: Vec3;
  rotation: number;
  hasWindow: boolean;
  windowConfig?: WindowConfig;
  hasDoor: boolean;
  doorConfig?: DoorOpeningConfig;
}

export interface WindowConfig {
  width: number;
  height: number;
  fromFloor: number;
  fromLeft: number;
}

export interface DoorOpeningConfig {
  width: number;
  height: number;
  fromLeft: number;
}

export interface Cabinet {
  id: string;
  category: CabinetCategory;
  type: BaseCabinetType | WallCabinetType | TallCabinetType;
  position: Vec3;
  rotation: number;
  width: number;
  height: number;
  depth: number;
  doorStyle: DoorStyle;
  doorColor: string;
  bodyColor: string;
  handleStyle: HandleStyle;
  handleColor: string;
  hingeSide: 'left' | 'right';
  wallId?: string;
  toeKickHeight?: number;
  mountingHeight?: number;
}

export interface Appliance {
  id: string;
  type: ApplianceType;
  position: Vec3;
  rotation: number;
  width: number;
  height: number;
  depth: number;
  color: string;
}

export interface IslandConfig {
  id: string;
  position: Vec3;
  width: number;
  length: number;
  height: number;
  cabinets: Cabinet[];
  hasCountertop: boolean;
  overhangSides: {
    front: number;
    back: number;
    left: number;
    right: number;
  };
  hasSink: boolean;
  hasCooktop: boolean;
}

export interface CountertopConfig {
  material: CountertopMaterial;
  color: string;
  thickness: number;
  edgeProfile: EdgeProfile;
  overhangFront: number;
  overhangSides: number;
  backsplashHeight: BacksplashHeight;
}

export interface LightingConfig {
  ambientIntensity: number;
  underCabinetLights: boolean;
  pendantLights: number;
  pendantStyle: 'modern' | 'industrial' | 'classic';
  recessedLights: boolean;
  inCabinetLights: boolean;
  timeOfDay: number;
}

export interface ViewMode {
  type: 'perspective' | 'top' | 'front' | 'side';
}

export interface KitchenProject {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  layoutType: LayoutType;
  walls: Wall[];
  cabinets: Cabinet[];
  appliances: Appliance[];
  countertop: CountertopConfig;
  island: IslandConfig | null;
  lighting: LightingConfig;
  globalStyle: GlobalStyle;
}

export interface GlobalStyle {
  cabinetDoorStyle: DoorStyle;
  cabinetBodyColor: string;
  cabinetDoorColor: string;
  handleStyle: HandleStyle;
  handleColor: string;
}
