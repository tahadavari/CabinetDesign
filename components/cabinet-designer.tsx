"use client";

import { Suspense, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, RoundedBox, Text } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Layers3, Move3D, Ruler, Sparkles, Workflow } from "lucide-react";

type CabinetPreset = "base" | "wall" | "tall";

type MaterialPalette = {
  frame: string;
  door: string;
  counter: string;
};

const palettes: Record<string, MaterialPalette> = {
  walnut: { frame: "#8f6b4a", door: "#a57a51", counter: "#20262f" },
  oak: { frame: "#c9a172", door: "#d7b083", counter: "#31353c" },
  white: { frame: "#d7dce3", door: "#f8fafc", counter: "#3b434d" }
};

function CabinetMesh({ width, height, depth, openRatio, palette }: { width: number; height: number; depth: number; openRatio: number; palette: MaterialPalette }) {
  const doorOffset = useMemo(() => (width / 2) * (openRatio / 100), [openRatio, width]);

  return (
    <group>
      <RoundedBox args={[width, height, depth]} radius={0.04} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color={palette.frame} metalness={0.1} roughness={0.7} />
      </RoundedBox>

      <RoundedBox args={[width * 0.46, height * 0.92, 0.03]} radius={0.03} position={[-width * 0.25 - doorOffset, 0, depth / 2 + 0.02]} castShadow>
        <meshStandardMaterial color={palette.door} metalness={0.05} roughness={0.6} />
      </RoundedBox>

      <RoundedBox args={[width * 0.46, height * 0.92, 0.03]} radius={0.03} position={[width * 0.25 + doorOffset, 0, depth / 2 + 0.02]} castShadow>
        <meshStandardMaterial color={palette.door} metalness={0.05} roughness={0.6} />
      </RoundedBox>

      <RoundedBox args={[width + 0.15, 0.05, depth + 0.12]} radius={0.02} position={[0, height / 2 + 0.04, 0]}>
        <meshStandardMaterial color={palette.counter} metalness={0.2} roughness={0.5} />
      </RoundedBox>

      <Text position={[0, -height / 2 - 0.12, depth / 2]} fontSize={0.08} color="#d4d4d8" anchorX="center" anchorY="middle">
        {`${Math.round(width * 100)} × ${Math.round(depth * 100)} × ${Math.round(height * 100)} cm`}
      </Text>
    </group>
  );
}

export function CabinetDesigner() {
  const [preset, setPreset] = useState<CabinetPreset>("base");
  const [openRatio, setOpenRatio] = useState([15]);
  const [moduleCount, setModuleCount] = useState([3]);
  const [paletteKey, setPaletteKey] = useState<keyof typeof palettes>("walnut");

  const dims = useMemo(() => {
    if (preset === "wall") return { width: 1.8, height: 1.0, depth: 0.45 };
    if (preset === "tall") return { width: 1.2, height: 2.2, depth: 0.62 };
    return { width: 2.1, height: 0.9, depth: 0.62 };
  }, [preset]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#334155_0%,#0b1120_45%,#020617_100%)] p-5 md:p-8">
      <section className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[360px_1fr]">
        <Card className="backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl"><Sparkles className="h-5 w-5 text-primary" />استودیو طراحی کابینت سه‌بعدی</CardTitle>
            <CardDescription>پارامتریک، منعطف و آماده‌ی طراحی آشپزخانه کامل.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">تیپ کابینت</p>
              <div className="grid grid-cols-3 gap-2">
                <Button variant={preset === "base" ? "default" : "secondary"} onClick={() => setPreset("base")}>زمینی</Button>
                <Button variant={preset === "wall" ? "default" : "secondary"} onClick={() => setPreset("wall")}>هوایی</Button>
                <Button variant={preset === "tall" ? "default" : "secondary"} onClick={() => setPreset("tall")}>ایستاده</Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="flex items-center gap-2 text-sm"><Move3D className="h-4 w-4 text-accent" />درصد باز بودن درب: {openRatio[0]}%</p>
              <Slider value={openRatio} max={90} step={1} onValueChange={setOpenRatio} />
            </div>

            <div className="space-y-2">
              <p className="flex items-center gap-2 text-sm"><Layers3 className="h-4 w-4 text-accent" />تعداد ماژول: {moduleCount[0]}</p>
              <Slider value={moduleCount} min={1} max={6} step={1} onValueChange={setModuleCount} />
            </div>

            <div className="space-y-2">
              <p className="text-sm">پالت متریال</p>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(palettes) as Array<keyof typeof palettes>).map((key) => (
                  <Button key={key} variant={paletteKey === key ? "default" : "outline"} onClick={() => setPaletteKey(key)}>
                    {key === "walnut" ? "گردویی" : key === "oak" ? "بلوط" : "سفید"}
                  </Button>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
              <p className="mb-2 flex items-center gap-2 text-sm text-foreground"><Workflow className="h-4 w-4 text-primary" />فیچرهای توسعه‌پذیر این نسخه</p>
              <ul className="list-disc space-y-1 pr-4">
                <li>حالت پلان U / L / جزیره برای چیدمان کامل آشپزخانه</li>
                <li>مدیریت یونیت، سوپر، کشو، اکسسوری و ماژول‌های گوشه</li>
                <li>تعریف متریال، یراق‌آلات، دستگیره و خروجی BOM</li>
                <li>کنترل اندازه‌ها با استاندارد ارگونومی و متره</li>
              </ul>
            </div>

            <div className="rounded-lg bg-secondary/50 p-3 text-xs text-muted-foreground">
              <p className="flex items-center gap-2 text-sm text-foreground"><Ruler className="h-4 w-4 text-primary" />ابعاد فعلی هر ماژول</p>
              <p className="mt-1">عرض: {Math.round((dims.width / moduleCount[0]) * 100)} سانتی‌متر</p>
              <p>ارتفاع: {Math.round(dims.height * 100)} سانتی‌متر</p>
              <p>عمق: {Math.round(dims.depth * 100)} سانتی‌متر</p>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-primary/20">
          <CardContent className="h-[72vh] p-0">
            <Canvas camera={{ position: [2.7, 1.8, 3], fov: 48 }} shadows>
              <color attach="background" args={["#0f172a"]} />
              <ambientLight intensity={0.6} />
              <directionalLight position={[4, 6, 3]} intensity={1.2} castShadow />
              <Suspense fallback={null}>
                <Environment preset="city" />
                <group position={[-dims.width / 2 + dims.width / moduleCount[0] / 2, dims.height / 2, 0]}>
                  {Array.from({ length: moduleCount[0] }).map((_, index) => (
                    <group key={index} position={[index * (dims.width / moduleCount[0]), 0, 0]}>
                      <CabinetMesh
                        width={dims.width / moduleCount[0] - 0.04}
                        height={dims.height}
                        depth={dims.depth}
                        openRatio={openRatio[0]}
                        palette={palettes[paletteKey]}
                      />
                    </group>
                  ))}
                </group>
              </Suspense>
              <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial color="#111827" roughness={0.9} metalness={0.05} />
              </mesh>
              <OrbitControls makeDefault minDistance={1.8} maxDistance={8} target={[0, dims.height / 2, 0]} />
            </Canvas>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
