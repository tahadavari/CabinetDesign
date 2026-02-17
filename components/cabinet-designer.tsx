"use client";

import { Suspense, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, RoundedBox, Text } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  alignUnits,
  assignAccessory,
  createGroup,
  createProject,
  createUnit,
  defaultModules,
  deleteUnit,
  duplicateUnit,
  ergonomicWarnings,
  generateBOM,
  LayoutMode,
  measurementReport,
  moveUnit,
  readyToBuildChecklist,
  rotateUnit,
  snapUnits,
  switchLayoutMode,
  toggleLockUnit,
  validateLayout
} from "@/lib/kitchen-planner";
import { CheckCircle2, Copy, Lock, RotateCw, Ruler, Settings2, Sparkles, Trash2, Wand2 } from "lucide-react";

const wizardSteps = ["Layout", "Units", "Appliances", "Finishes", "BOM"] as const;

function UnitMesh({ unit, selected }: { unit: ReturnType<typeof createProject>["units"][number]; selected: boolean }) {
  const color = unit.category === "wall" ? "#93c5fd" : unit.category === "tall" || unit.category === "pantry" ? "#f59e0b" : "#34d399";
  return (
    <group position={[unit.x / 100 - 1.5, unit.height / 200, unit.y / 100 - 1]} rotation={[0, (unit.rotation * Math.PI) / 180, 0]}>
      <RoundedBox args={[unit.width / 100, unit.height / 100, unit.depth / 100]} radius={0.02} smoothness={3} castShadow>
        <meshStandardMaterial color={selected ? "#f43f5e" : color} metalness={0.1} roughness={0.65} />
      </RoundedBox>
      <Text position={[0, -unit.height / 200 - 0.05, unit.depth / 200]} fontSize={0.04} color="#e2e8f0">
        {unit.name}
      </Text>
    </group>
  );
}

export function CabinetDesigner() {
  const [project, setProject] = useState(() => createProject("Complete Kitchen", "L"));
  const [step, setStep] = useState(0);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  const selectedUnit = project.units.find((u) => u.id === selectedUnitId) ?? null;
  const issues = useMemo(() => validateLayout(project), [project]);
  const ergo = useMemo(() => ergonomicWarnings(project), [project]);
  const bom = useMemo(() => generateBOM(project), [project]);
  const report = useMemo(() => measurementReport(project), [project]);
  const checklist = useMemo(() => readyToBuildChecklist(project), [project]);

  const changeMode = (mode: LayoutMode) => setProject((prev) => switchLayoutMode(prev, mode));

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#334155_0%,#0b1120_45%,#020617_100%)] p-5 md:p-8">
      <section className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[430px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl"><Sparkles className="h-5 w-5 text-primary" />Kitchen Completion Wizard</CardTitle>
            <CardDescription>layout → units → appliances → finishes → BOM</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 text-sm">
            <div className="grid grid-cols-5 gap-1">
              {wizardSteps.map((item, index) => (
                <Button key={item} size="sm" variant={step === index ? "default" : "secondary"} onClick={() => setStep(index)}>{item}</Button>
              ))}
            </div>

            <div className="space-y-2 rounded border p-3">
              <p className="font-medium">Kitchen layout mode</p>
              <div className="grid grid-cols-3 gap-2">
                {(["U", "L", "Island"] as LayoutMode[]).map((mode) => (
                  <Button key={mode} variant={project.mode === mode ? "default" : "outline"} onClick={() => changeMode(mode)}>{mode}-Shape</Button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label>Wall A: <input className="ml-1 w-16 rounded bg-secondary px-1" type="number" value={project.footprint.wallA} onChange={(e) => setProject((p) => ({ ...p, footprint: { ...p.footprint, wallA: Number(e.target.value) } }))} />cm</label>
                <label>Wall B: <input className="ml-1 w-16 rounded bg-secondary px-1" type="number" value={project.footprint.wallB} onChange={(e) => setProject((p) => ({ ...p, footprint: { ...p.footprint, wallB: Number(e.target.value) } }))} />cm</label>
                {project.mode === "U" && <label>Wall C: <input className="ml-1 w-16 rounded bg-secondary px-1" type="number" value={project.footprint.wallC ?? 0} onChange={(e) => setProject((p) => ({ ...p, footprint: { ...p.footprint, wallC: Number(e.target.value) } }))} />cm</label>}
                <label>Aisle: <input className="ml-1 w-16 rounded bg-secondary px-1" type="number" value={project.footprint.aisleMin} onChange={(e) => setProject((p) => ({ ...p, footprint: { ...p.footprint, aisleMin: Number(e.target.value) } }))} />cm</label>
              </div>
              {project.mode === "Island" && project.footprint.island && (
                <div className="grid grid-cols-2 gap-2">
                  <label>Island W: <input className="ml-1 w-16 rounded bg-secondary px-1" type="number" value={project.footprint.island.width} onChange={(e) => setProject((p) => ({ ...p, footprint: { ...p.footprint, island: { ...p.footprint.island!, width: Number(e.target.value) } } }))} /></label>
                  <label>Island D: <input className="ml-1 w-16 rounded bg-secondary px-1" type="number" value={project.footprint.island.depth} onChange={(e) => setProject((p) => ({ ...p, footprint: { ...p.footprint, island: { ...p.footprint.island!, depth: Number(e.target.value) } } }))} /></label>
                </div>
              )}
            </div>

            <div className="space-y-2 rounded border p-3">
              <p className="font-medium">Unit (cabinet) management</p>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" onClick={() => setProject((p) => createUnit(p, "base-60", "A"))}>+ Add base</Button>
                <Button size="sm" variant="outline" onClick={() => setProject((p) => createUnit(p, "pantry-super", "B"))}>+ Add super pantry</Button>
                <Button size="sm" variant="outline" onClick={() => selectedUnitId && setProject((p) => (selectedUnitId ? rotateUnit(p, selectedUnitId) : p))}><RotateCw className="mr-1 h-4 w-4" />Rotate</Button>
                <Button size="sm" variant="outline" onClick={() => selectedUnitId && setProject((p) => (selectedUnitId ? duplicateUnit(p, selectedUnitId) : p))}><Copy className="mr-1 h-4 w-4" />Duplicate</Button>
                <Button size="sm" variant="outline" onClick={() => selectedUnitId && setProject((p) => (selectedUnitId ? toggleLockUnit(p, selectedUnitId) : p))}><Lock className="mr-1 h-4 w-4" />Lock/Unlock</Button>
                <Button size="sm" variant="destructive" onClick={() => selectedUnitId && setProject((p) => (selectedUnitId ? deleteUnit(p, selectedUnitId) : p))}><Trash2 className="mr-1 h-4 w-4" />Delete</Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="secondary" onClick={() => selectedUnitId && setProject((p) => (selectedUnitId ? moveUnit(p, selectedUnitId, (selectedUnit?.x ?? 0) + 10, selectedUnit?.y ?? 0) : p))}>Move +10cm</Button>
                <Button size="sm" variant="secondary" onClick={() => setProject((p) => snapUnits(p))}><Wand2 className="mr-1 h-4 w-4" />Snap all</Button>
                <Button size="sm" variant="secondary" onClick={() => setProject((p) => alignUnits(p, p.units.slice(0, 2).map((u) => u.id), "x"))}>Align first two</Button>
                <Button size="sm" variant="secondary" onClick={() => setProject((p) => createGroup(p, p.units.slice(0, 3).map((u) => u.id), "Main run"))}>Group run</Button>
              </div>
            </div>

            {selectedUnit && (
              <div className="space-y-2 rounded border p-3">
                <p className="font-medium">Selected: {selectedUnit.name}</p>
                <p className="text-xs">Category: {selectedUnit.category} | Wall: {selectedUnit.wall}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setProject((p) =>
                      assignAccessory(p, selectedUnit.id, {
                        id: "cutlery",
                        name: "Cutlery insert",
                        compartment: "drawer",
                        compatibleCategories: ["base"],
                        minWidth: 60,
                        sku: "ACC-CUT"
                      })
                    )
                  }
                >
                  Add cutlery accessory
                </Button>
              </div>
            )}

            <div className="rounded border p-3">
              <p className="mb-2 flex items-center gap-2 font-medium"><Settings2 className="h-4 w-4" />Validation + ergonomics</p>
              {issues.length === 0 ? <p className="text-emerald-400">No layout feasibility issues.</p> : issues.map((issue) => <p key={issue} className="text-amber-300">• {issue}</p>)}
              {ergo.map((w) => <p key={w.warning} className="text-xs text-muted-foreground">{w.warning} Suggestion: {w.suggestion}</p>)}
            </div>

            <div className="rounded border p-3">
              <p className="mb-2 flex items-center gap-2 font-medium"><Ruler className="h-4 w-4" />Measurement takeoff</p>
              <p>Total cabinets: {report.totalCabinets}</p>
              <p>Total worktop length: {report.totalWorktopLength} cm</p>
              <p>Door area: {report.doorArea} m²</p>
              <p>Panels area: {report.panelArea} m²</p>
              <p>Edges: {report.edgeLinearMeters} lm</p>
            </div>

            <div className="rounded border p-3">
              <p className="mb-2 flex items-center gap-2 font-medium"><CheckCircle2 className="h-4 w-4" />Ready-to-build checklist</p>
              {checklist.map((item) => (
                <p key={item.check} className={item.ok ? "text-emerald-400" : "text-amber-300"}>{item.ok ? "✓" : "•"} {item.check}</p>
              ))}
            </div>

            <div className="rounded border p-3">
              <p className="mb-2 font-medium">BOM (structured)</p>
              <pre className="max-h-40 overflow-auto text-[11px]">{JSON.stringify(bom, null, 2)}</pre>
            </div>

            <div className="rounded border p-3">
              <p className="mb-2 font-medium">Module library</p>
              <div className="max-h-32 overflow-auto text-xs">
                {defaultModules.map((m) => (
                  <p key={m.id}>{m.name} ({m.width}×{m.height}×{m.depth}) {m.sku ? `- ${m.sku}` : ""}</p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-primary/20">
          <CardContent className="h-[78vh] p-0">
            <Canvas camera={{ position: [2.8, 1.9, 3.4], fov: 50 }} shadows>
              <color attach="background" args={["#0f172a"]} />
              <ambientLight intensity={0.65} />
              <directionalLight position={[4, 6, 3]} intensity={1.2} castShadow />
              <Suspense fallback={null}>
                <Environment preset="city" />
                {project.units.map((unit) => (
                  <group key={unit.id} onClick={() => setSelectedUnitId(unit.id)}>
                    <UnitMesh unit={unit} selected={selectedUnitId === unit.id} />
                  </group>
                ))}
              </Suspense>
              <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[12, 12]} />
                <meshStandardMaterial color="#111827" roughness={0.9} metalness={0.05} />
              </mesh>
              <OrbitControls makeDefault minDistance={1.4} maxDistance={8} target={[0, 0.7, 0]} />
            </Canvas>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
