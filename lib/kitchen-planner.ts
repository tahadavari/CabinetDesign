export type LayoutMode = "U" | "L" | "Island";

export type UnitCategory = "base" | "wall" | "tall" | "applianceHousing" | "pantry";
export type CornerType = "blind" | "carousel" | "lDrawer";
export type DrawerType = "single" | "double" | "triple" | "deep";
export type PantryStyle = "fullPullOut" | "internalPullOut" | "mixedShelves";
export type DoorType = "single" | "double" | "pocket";
export type HandleType = "bar" | "knob" | "profile" | "integrated" | "pushToOpen";

export type BrandStandard = {
  name: string;
  baseWidths: number[];
  wallHeights: number[];
  depths: number[];
};

export type ModuleDefinition = {
  id: string;
  name: string;
  category: UnitCategory;
  width: number;
  height: number;
  depth: number;
  sku?: string;
  minWidth: number;
  maxWidth: number;
  drawerType?: DrawerType;
  cornerType?: CornerType;
  superUnit?: {
    pantryStyle?: PantryStyle;
    applianceTower?: boolean;
    doorType: DoorType;
    openingSide: "left" | "right";
  };
};

export type Accessory = {
  id: string;
  name: string;
  compartment: string;
  compatibleCategories: UnitCategory[];
  minWidth: number;
  sku?: string;
};

export type HardwareSet = {
  hinges: number;
  runners: number;
  lifts: number;
  series: string;
  brand: string;
  softClose: boolean;
};

export type MaterialAssignment = {
  body: string;
  door: string;
  worktop: string;
  backsplash: string;
  panels: string;
  shelves: string;
  colorCode: string;
  finishType: string;
};

export type ApplianceType = "sink" | "faucet" | "cooktop" | "oven" | "microwave" | "hood" | "fridge" | "dishwasher";

export type Appliance = {
  id: string;
  type: ApplianceType;
  width: number;
  requiresVentilationGap: number;
  requiredClearance: number;
  model: string;
};

export type ServicePoint = {
  id: string;
  type: "waterIn" | "waterOut" | "gas" | "electric" | "hoodVent";
  x: number;
  y: number;
};

export type KitchenUnit = {
  id: string;
  moduleId: string;
  name: string;
  category: UnitCategory;
  width: number;
  height: number;
  depth: number;
  x: number;
  y: number;
  rotation: 0 | 90 | 180 | 270;
  wall: "A" | "B" | "C" | "Island";
  locked: boolean;
  groupId?: string;
  materials: MaterialAssignment;
  hardware: HardwareSet;
  handle: {
    type: HandleType;
    placement: "vertical" | "horizontal";
    offset: number;
  };
  accessories: Accessory[];
};

export type Footprint = {
  wallA: number;
  wallB: number;
  wallC?: number;
  aisleMin: number;
  island?: {
    width: number;
    depth: number;
    x: number;
    y: number;
  };
};

export type KitchenProject = {
  id: string;
  name: string;
  mode: LayoutMode;
  standard: BrandStandard;
  footprint: Footprint;
  units: KitchenUnit[];
  modulesLibrary: ModuleDefinition[];
  appliances: Appliance[];
  servicePoints: ServicePoint[];
  materialPreset: MaterialAssignment;
  groups: Array<{ id: string; name: string; unitIds: string[] }>;
};

export const defaultStandard: BrandStandard = {
  name: "EU-600",
  baseWidths: [30, 40, 45, 50, 60, 80, 90, 100, 120],
  wallHeights: [70, 90, 100],
  depths: [32, 37, 45, 56, 60]
};

export const defaultMaterials: MaterialAssignment = {
  body: "Melamine White",
  door: "Matte Sand",
  worktop: "Quartz Grey",
  backsplash: "Ceramic Warm White",
  panels: "Melamine White",
  shelves: "Melamine White",
  colorCode: "RAL-9003",
  finishType: "matte"
};

export const defaultModules: ModuleDefinition[] = [
  { id: "base-60", name: "Base 60", category: "base", width: 60, height: 72, depth: 56, minWidth: 50, maxWidth: 100, sku: "B60" },
  { id: "base-draw-90", name: "Drawer Base 90", category: "base", width: 90, height: 72, depth: 56, minWidth: 80, maxWidth: 100, drawerType: "triple", sku: "BD90" },
  { id: "wall-80", name: "Wall 80", category: "wall", width: 80, height: 90, depth: 32, minWidth: 60, maxWidth: 100, sku: "W80" },
  { id: "tall-60", name: "Tall 60", category: "tall", width: 60, height: 220, depth: 60, minWidth: 50, maxWidth: 80, sku: "T60" },
  { id: "pantry-super", name: "Super Pantry", category: "pantry", width: 60, height: 220, depth: 60, minWidth: 50, maxWidth: 80, sku: "SP60", superUnit: { pantryStyle: "fullPullOut", doorType: "single", openingSide: "left" } },
  { id: "corner-carousel", name: "Corner Carousel", category: "base", width: 100, height: 72, depth: 100, minWidth: 90, maxWidth: 110, cornerType: "carousel", sku: "CC100" },
  { id: "appliance-tower", name: "Appliance Tower", category: "applianceHousing", width: 60, height: 220, depth: 60, minWidth: 60, maxWidth: 70, sku: "AT60", superUnit: { applianceTower: true, doorType: "double", openingSide: "right" } }
];

const defaultHardwareByCategory: Record<UnitCategory, HardwareSet> = {
  base: { hinges: 4, runners: 0, lifts: 0, series: "Movento", brand: "Blum", softClose: true },
  wall: { hinges: 2, runners: 0, lifts: 1, series: "Aventos", brand: "Blum", softClose: true },
  tall: { hinges: 5, runners: 0, lifts: 0, series: "ClipTop", brand: "Blum", softClose: true },
  applianceHousing: { hinges: 4, runners: 0, lifts: 0, series: "ClipTop", brand: "Blum", softClose: true },
  pantry: { hinges: 4, runners: 2, lifts: 0, series: "Legrabox", brand: "Blum", softClose: true }
};

export function createProject(name: string, mode: LayoutMode): KitchenProject {
  return {
    id: `project-${Date.now()}`,
    name,
    mode,
    standard: defaultStandard,
    footprint: {
      wallA: 360,
      wallB: 300,
      wallC: mode === "U" ? 320 : undefined,
      aisleMin: 100,
      island: mode === "Island" ? { width: 180, depth: 90, x: 110, y: 120 } : undefined
    },
    units: generateCompleteKitchen(mode),
    modulesLibrary: defaultModules,
    appliances: [],
    servicePoints: [],
    materialPreset: defaultMaterials,
    groups: []
  };
}

function toUnit(module: ModuleDefinition, index: number, wall: KitchenUnit["wall"], x: number, y: number): KitchenUnit {
  return {
    id: `${module.id}-${index}`,
    moduleId: module.id,
    name: module.name,
    category: module.category,
    width: module.width,
    height: module.height,
    depth: module.depth,
    x,
    y,
    rotation: wall === "B" ? 90 : wall === "C" ? 180 : wall === "Island" ? 0 : 0,
    wall,
    locked: false,
    materials: defaultMaterials,
    hardware: defaultHardwareByCategory[module.category],
    handle: { type: "bar", placement: "vertical", offset: 60 },
    accessories: []
  };
}

export function generateCompleteKitchen(mode: LayoutMode): KitchenUnit[] {
  const base = defaultModules.find((m) => m.id === "base-60")!;
  const drawer = defaultModules.find((m) => m.id === "base-draw-90")!;
  const wall = defaultModules.find((m) => m.id === "wall-80")!;
  const tall = defaultModules.find((m) => m.id === "tall-60")!;
  const corner = defaultModules.find((m) => m.id === "corner-carousel")!;
  const pantry = defaultModules.find((m) => m.id === "pantry-super")!;

  const units: KitchenUnit[] = [
    toUnit(base, 1, "A", 0, 0),
    toUnit(drawer, 2, "A", 65, 0),
    toUnit(base, 3, "A", 160, 0),
    toUnit(wall, 4, "A", 0, 90),
    toUnit(wall, 5, "A", 90, 90),
    toUnit(tall, 6, "A", 250, 0)
  ];

  if (mode === "L" || mode === "U") {
    units.push(toUnit(corner, 7, "A", 320, 0));
    units.push(toUnit(base, 8, "B", 0, 65));
    units.push(toUnit(pantry, 9, "B", 0, 130));
  }

  if (mode === "U") {
    units.push(toUnit(base, 10, "C", 75, 0));
    units.push(toUnit(drawer, 11, "C", 165, 0));
  }

  if (mode === "Island") {
    units.push(toUnit(drawer, 12, "Island", 120, 120));
    units.push(toUnit(base, 13, "Island", 215, 120));
  }

  return units;
}

export function switchLayoutMode(project: KitchenProject, mode: LayoutMode): KitchenProject {
  const previousUnits = project.units;
  const templateUnits = generateCompleteKitchen(mode);

  const reused = templateUnits.map((nextUnit) => {
    const sameCategory = previousUnits.find((u) => u.category === nextUnit.category && !u.locked);
    return sameCategory
      ? {
          ...nextUnit,
          id: sameCategory.id,
          moduleId: sameCategory.moduleId,
          name: sameCategory.name,
          width: sameCategory.width,
          height: sameCategory.height,
          depth: sameCategory.depth,
          materials: sameCategory.materials,
          accessories: sameCategory.accessories,
          hardware: sameCategory.hardware,
          handle: sameCategory.handle
        }
      : nextUnit;
  });

  return {
    ...project,
    mode,
    footprint: {
      ...project.footprint,
      wallC: mode === "U" ? project.footprint.wallC ?? 320 : undefined,
      island: mode === "Island" ? project.footprint.island ?? { width: 180, depth: 90, x: 110, y: 120 } : undefined
    },
    units: reused
  };
}

export function createUnit(project: KitchenProject, moduleId: string, wall: KitchenUnit["wall"]): KitchenProject {
  const module = project.modulesLibrary.find((m) => m.id === moduleId);
  if (!module) return project;
  const sameWall = project.units.filter((u) => u.wall === wall);
  const x = sameWall.length === 0 ? 0 : Math.max(...sameWall.map((u) => u.x + u.width + 3));
  const unit = toUnit(module, project.units.length + 1, wall, x, wall === "A" ? 0 : 65);
  return { ...project, units: [...project.units, unit] };
}

export function moveUnit(project: KitchenProject, unitId: string, x: number, y: number): KitchenProject {
  return {
    ...project,
    units: project.units.map((u) => (u.id === unitId && !u.locked ? { ...u, x, y } : u))
  };
}

export function rotateUnit(project: KitchenProject, unitId: string): KitchenProject {
  return {
    ...project,
    units: project.units.map((u) => (u.id === unitId && !u.locked ? { ...u, rotation: (((u.rotation + 90) % 360) as KitchenUnit["rotation"]) } : u))
  };
}

export function alignUnits(project: KitchenProject, unitIds: string[], axis: "x" | "y"): KitchenProject {
  const selected = project.units.filter((u) => unitIds.includes(u.id));
  if (!selected.length) return project;
  const target = Math.min(...selected.map((u) => (axis === "x" ? u.x : u.y)));
  return {
    ...project,
    units: project.units.map((u) => (unitIds.includes(u.id) && !u.locked ? { ...u, [axis]: target } : u))
  };
}

export function duplicateUnit(project: KitchenProject, unitId: string): KitchenProject {
  const unit = project.units.find((u) => u.id === unitId);
  if (!unit) return project;
  const clone: KitchenUnit = { ...unit, id: `${unit.id}-copy-${project.units.length}`, x: unit.x + unit.width + 3 };
  return { ...project, units: [...project.units, clone] };
}

export function toggleLockUnit(project: KitchenProject, unitId: string): KitchenProject {
  return { ...project, units: project.units.map((u) => (u.id === unitId ? { ...u, locked: !u.locked } : u)) };
}

export function deleteUnit(project: KitchenProject, unitId: string): KitchenProject {
  return { ...project, units: project.units.filter((u) => u.id !== unitId), groups: project.groups.map((g) => ({ ...g, unitIds: g.unitIds.filter((id) => id !== unitId) })) };
}

export function snapUnits(project: KitchenProject): KitchenProject {
  const snapped = project.units
    .slice()
    .sort((a, b) => a.wall.localeCompare(b.wall) || a.x - b.x)
    .map((u, idx, arr) => {
      const previous = arr[idx - 1];
      if (previous && previous.wall === u.wall) {
        return { ...u, x: previous.x + previous.width + 2 };
      }
      return { ...u, x: Math.round(u.x / 5) * 5, y: Math.round(u.y / 5) * 5 };
    });

  return { ...project, units: snapped };
}

export function autoFillWithFillers(project: KitchenProject): Array<{ wall: string; width: number }> {
  const wallLengths: Record<string, number> = {
    A: project.footprint.wallA,
    B: project.footprint.wallB,
    C: project.footprint.wallC ?? 0,
    Island: project.footprint.island?.width ?? 0
  };

  return Object.entries(wallLengths)
    .filter(([, length]) => length > 0)
    .map(([wall, length]) => {
      const used = project.units.filter((u) => u.wall === wall).reduce((sum, unit) => sum + unit.width + 2, 0);
      return { wall, width: Math.max(0, Math.round(length - used)) };
    })
    .filter((filler) => filler.width > 0);
}

export function autoGenerateWorktop(project: KitchenProject): Array<{ wall: string; length: number; jointType: "straight" | "corner" }> {
  const byWall = ["A", "B", "C", "Island"] as const;
  const segments = byWall
    .map((wall) => {
      const length = project.units.filter((u) => u.wall === wall && u.category === "base").reduce((sum, u) => sum + u.width, 0);
      return { wall, length, jointType: "straight" as const };
    })
    .filter((segment) => segment.length > 0);

  if (project.mode === "L" || project.mode === "U") {
    segments.push({ wall: "A-B", length: 0, jointType: "corner" });
  }
  if (project.mode === "U") {
    segments.push({ wall: "B-C", length: 0, jointType: "corner" });
  }
  return segments;
}

export function createGroup(project: KitchenProject, unitIds: string[], name: string): KitchenProject {
  const id = `group-${project.groups.length + 1}`;
  const group = { id, name, unitIds };
  return {
    ...project,
    groups: [...project.groups, group],
    units: project.units.map((unit) => (unitIds.includes(unit.id) ? { ...unit, groupId: id } : unit))
  };
}

export function assignAccessory(project: KitchenProject, unitId: string, accessory: Accessory): KitchenProject {
  return {
    ...project,
    units: project.units.map((u) => {
      if (u.id !== unitId) return u;
      if (!accessory.compatibleCategories.includes(u.category) || u.width < accessory.minWidth) return u;
      return { ...u, accessories: [...u.accessories, accessory] };
    })
  };
}

export function validateLayout(project: KitchenProject): string[] {
  const issues: string[] = [];
  if (project.footprint.aisleMin < 90) issues.push("Minimum aisle clearance should be at least 90cm.");

  const collisions = detectCollisions(project.units);
  if (collisions.length) issues.push(`Detected ${collisions.length} unit collision(s).`);

  if (project.mode === "Island" && project.footprint.island && project.footprint.aisleMin < 100) {
    issues.push("Island mode requires at least 100cm clearance around island.");
  }

  const drawerBlocks = project.units.filter((u) => u.moduleId.includes("draw") && project.footprint.aisleMin < 105).length;
  if (drawerBlocks > 0) issues.push("Drawer opening clearance below 105cm opposite run guidance.");

  return issues;
}

export function ergonomicWarnings(project: KitchenProject): Array<{ warning: string; suggestion: string }> {
  const warnings: Array<{ warning: string; suggestion: string }> = [];
  const counterHeight = 92;
  if (counterHeight < 88 || counterHeight > 95) {
    warnings.push({ warning: "Counter height outside ergonomic range 88-95cm.", suggestion: "Adjust plinth/worktop to target 91cm." });
  }

  if (project.footprint.aisleMin < 100) {
    warnings.push({ warning: "Aisle is tighter than recommended 100cm.", suggestion: `Increase aisle by ${100 - project.footprint.aisleMin}cm.` });
  }

  const fridge = project.appliances.find((a) => a.type === "fridge");
  const sink = project.appliances.find((a) => a.type === "sink");
  const hob = project.appliances.find((a) => a.type === "cooktop");
  if (!(fridge && sink && hob)) {
    warnings.push({ warning: "Work triangle incomplete.", suggestion: "Place fridge, sink and cooktop to complete work triangle." });
  }

  return warnings;
}

export function detectCollisions(units: KitchenUnit[]): Array<[string, string]> {
  const collisions: Array<[string, string]> = [];
  for (let i = 0; i < units.length; i += 1) {
    for (let j = i + 1; j < units.length; j += 1) {
      const a = units[i];
      const b = units[j];
      const overlapX = a.x < b.x + b.width && a.x + a.width > b.x;
      const overlapY = a.y < b.y + b.depth && a.y + a.depth > b.y;
      if (a.wall === b.wall && overlapX && overlapY) collisions.push([a.id, b.id]);
    }
  }
  return collisions;
}

export function generateBOM(project: KitchenProject) {
  const unitsBySku = project.units.reduce<Record<string, { sku: string; name: string; count: number; width: number; height: number; depth: number }>>((acc, unit) => {
    const module = project.modulesLibrary.find((m) => m.id === unit.moduleId);
    const sku = module?.sku ?? unit.moduleId;
    if (!acc[sku]) acc[sku] = { sku, name: unit.name, count: 0, width: unit.width, height: unit.height, depth: unit.depth };
    acc[sku].count += 1;
    return acc;
  }, {});

  const accessories = project.units.flatMap((u) => u.accessories).reduce<Record<string, number>>((acc, item) => {
    acc[item.name] = (acc[item.name] ?? 0) + 1;
    return acc;
  }, {});

  const hardware = project.units.reduce(
    (acc, unit) => {
      acc.hinges += unit.hardware.hinges;
      acc.runners += unit.hardware.runners;
      acc.lifts += unit.hardware.lifts;
      return acc;
    },
    { hinges: 0, runners: 0, lifts: 0 }
  );

  return {
    units: Object.values(unitsBySku),
    fillers: autoFillWithFillers(project),
    worktops: autoGenerateWorktop(project),
    accessories,
    hardware,
    handles: project.units.reduce<Record<string, number>>((acc, unit) => {
      acc[unit.handle.type] = (acc[unit.handle.type] ?? 0) + 1;
      return acc;
    }, {}),
    materials: project.units.reduce<Record<string, number>>((acc, unit) => {
      acc[unit.materials.door] = (acc[unit.materials.door] ?? 0) + 1;
      return acc;
    }, {}),
    appliances: project.appliances.map((a) => ({ model: a.model, type: a.type, count: 1 })),
    totals: {
      totalUnits: project.units.length,
      totalWorktopLength: autoGenerateWorktop(project).reduce((sum, segment) => sum + segment.length, 0),
      totalPanelArea: Number((project.units.reduce((sum, unit) => sum + (unit.height * unit.depth) / 10000, 0)).toFixed(2))
    }
  };
}

export function measurementReport(project: KitchenProject) {
  const worktop = autoGenerateWorktop(project);
  return {
    runs: {
      wallA: project.footprint.wallA,
      wallB: project.footprint.wallB,
      wallC: project.footprint.wallC ?? 0
    },
    islandOffset: project.footprint.island ? { x: project.footprint.island.x, y: project.footprint.island.y } : null,
    totalCabinets: project.units.length,
    totalWorktopLength: worktop.reduce((sum, w) => sum + w.length, 0),
    doorArea: Number((project.units.reduce((sum, u) => sum + (u.width * u.height) / 10000, 0)).toFixed(2)),
    panelArea: Number((project.units.reduce((sum, u) => sum + (u.height * u.depth) / 10000, 0)).toFixed(2)),
    edgeLinearMeters: Number((worktop.reduce((sum, w) => sum + w.length, 0) / 100).toFixed(2))
  };
}

export function readyToBuildChecklist(project: KitchenProject): Array<{ check: string; ok: boolean }> {
  const layoutIssues = validateLayout(project);
  const worktopLength = autoGenerateWorktop(project).reduce((sum, segment) => sum + segment.length, 0);

  return [
    { check: "No unit collisions", ok: detectCollisions(project.units).length === 0 },
    { check: "Clearance rules validated", ok: layoutIssues.length === 0 },
    { check: "All units have hardware", ok: project.units.every((u) => u.hardware.brand.length > 0) },
    { check: "All units have handles or push-to-open", ok: project.units.every((u) => !!u.handle.type) },
    { check: "Worktop generated", ok: worktopLength > 0 },
    { check: "Corner solution assigned", ok: project.mode === "U" || project.mode === "L" ? project.units.some((u) => !!defaultModules.find((m) => m.id === u.moduleId)?.cornerType) : true },
    { check: "Material assigned", ok: project.units.every((u) => !!u.materials.door) },
    { check: "Appliances defined", ok: project.appliances.length > 0 }
  ];
}
