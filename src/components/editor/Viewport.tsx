'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { useKitchenStore } from '@/stores/kitchenStore';
import KitchenScene from '@/components/three/KitchenScene';

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#C8956C" wireframe />
    </mesh>
  );
}

export default function Viewport() {
  const viewMode = useKitchenStore((s) => s.viewMode);
  const cabinets = useKitchenStore((s) => s.cabinets);
  const appliances = useKitchenStore((s) => s.appliances);

  const isEmpty = cabinets.length === 0 && appliances.length === 0;

  // Camera position based on view mode
  const cameraConfig = (() => {
    switch (viewMode.type) {
      case 'top':
        return { position: [0, 8, 0] as [number, number, number], fov: 50 };
      case 'front':
        return { position: [0, 1.5, 5] as [number, number, number], fov: 50 };
      case 'side':
        return { position: [5, 1.5, 0] as [number, number, number], fov: 50 };
      default:
        return { position: [3, 3.5, 4] as [number, number, number], fov: 45 };
    }
  })();

  return (
    <div className="relative w-full h-full bg-zinc-950">
      <Canvas
        shadows
        camera={{ position: cameraConfig.position, fov: cameraConfig.fov, near: 0.01, far: 100 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor('#0a0a0a');
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = 2; // PCFSoftShadowMap
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <KitchenScene />
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.4}
            scale={12}
            blur={2.5}
            far={4}
          />
          <Environment preset="apartment" background={false} />
        </Suspense>

        <OrbitControls
          makeDefault
          minDistance={1}
          maxDistance={12}
          maxPolarAngle={viewMode.type === 'top' ? 0.01 : Math.PI / 2 - 0.05}
          minPolarAngle={viewMode.type === 'top' ? 0 : 0.1}
          enableDamping
          dampingFactor={0.08}
          target={[0, 0.8, 0]}
        />
      </Canvas>

      {/* Empty state overlay */}
      {isEmpty && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center p-8 rounded-xl bg-zinc-900/80 backdrop-blur border border-border/30 max-w-sm">
            <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-copper-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-copper-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Start Designing</h3>
            <p className="text-sm text-muted-foreground">
              Add cabinets and appliances from the catalog on the left,
              or drag items directly into the scene.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
