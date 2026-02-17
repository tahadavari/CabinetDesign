'use client';

import React from 'react';
import { useKitchenStore } from '@/stores/kitchenStore';

export default function Lighting() {
  const lighting = useKitchenStore((s) => s.lighting);

  // Map timeOfDay (0-24) to sun position and intensity
  const sunAngle = ((lighting.timeOfDay - 6) / 12) * Math.PI;
  const sunX = Math.cos(sunAngle) * 5;
  const sunY = Math.max(Math.sin(sunAngle) * 8, 1);
  const sunIntensity = Math.max(0.3, Math.sin(sunAngle) * 1.2);

  // Warm color at sunrise/sunset, white at noon
  const hourNorm = Math.abs(lighting.timeOfDay - 12) / 6;
  const warmth = Math.min(1, hourNorm);

  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={lighting.ambientIntensity * 0.5} color="#e8e0d8" />

      {/* Hemisphere light for natural fill */}
      <hemisphereLight
        args={['#87CEEB', '#362a1e', 0.3]}
      />

      {/* Main directional light (sun) */}
      <directionalLight
        position={[sunX, sunY, 3]}
        intensity={sunIntensity}
        color={warmth > 0.5 ? '#ffe0b2' : '#ffffff'}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0001}
      />

      {/* Fill light from opposite side */}
      <directionalLight
        position={[-3, 4, -2]}
        intensity={0.2}
        color="#b0c4de"
      />

      {/* Under-cabinet lights */}
      {lighting.underCabinetLights && (
        <>
          <pointLight position={[0, 1.35, -0.8]} intensity={0.4} color="#fff5e6" distance={3} decay={2} />
          <pointLight position={[-1.5, 1.35, -0.8]} intensity={0.4} color="#fff5e6" distance={3} decay={2} />
          <pointLight position={[1.5, 1.35, -0.8]} intensity={0.4} color="#fff5e6" distance={3} decay={2} />
        </>
      )}

      {/* Recessed ceiling lights */}
      {lighting.recessedLights && (
        <>
          <pointLight position={[0, 2.3, 0]} intensity={0.5} color="#fff8f0" distance={4} decay={2} />
          <pointLight position={[-1.5, 2.3, 0.5]} intensity={0.3} color="#fff8f0" distance={4} decay={2} />
          <pointLight position={[1.5, 2.3, 0.5]} intensity={0.3} color="#fff8f0" distance={4} decay={2} />
        </>
      )}

      {/* Pendant lights over island */}
      {lighting.pendantLights > 0 && (
        <>
          {Array.from({ length: lighting.pendantLights }).map((_, i) => {
            const spacing = 0.5;
            const offset = (i - (lighting.pendantLights - 1) / 2) * spacing;
            return (
              <group key={i} position={[offset, 1.8, 0.5]}>
                <pointLight intensity={0.6} color="#fff0d4" distance={3} decay={2} />
                {/* Simple pendant visual */}
                <mesh position={[0, 0.15, 0]}>
                  <cylinderGeometry args={[0.01, 0.01, 0.4, 8]} />
                  <meshStandardMaterial color="#333" />
                </mesh>
                <mesh>
                  <coneGeometry args={[0.08, 0.1, 16]} />
                  <meshStandardMaterial color="#C8956C" metalness={0.8} roughness={0.3} />
                </mesh>
              </group>
            );
          })}
        </>
      )}
    </>
  );
}
