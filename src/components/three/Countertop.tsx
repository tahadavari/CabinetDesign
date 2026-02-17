'use client';

import React, { useMemo } from 'react';
import { useKitchenStore } from '@/stores/kitchenStore';
import { cmToThree } from '@/lib/utils';
import * as THREE from 'three';

export default function Countertop() {
  const cabinets = useKitchenStore((s) => s.cabinets);
  const countertop = useKitchenStore((s) => s.countertop);

  const baseCabinets = useMemo(
    () => cabinets.filter((c) => c.category === 'base'),
    [cabinets]
  );

  const materialProps = useMemo(() => {
    const baseProps = {
      color: countertop.color,
      roughness: 0.3,
      metalness: 0.1,
    };

    switch (countertop.material) {
      case 'granite':
        return { ...baseProps, roughness: 0.4, metalness: 0.05 };
      case 'marble':
        return { ...baseProps, roughness: 0.2, metalness: 0.05 };
      case 'quartz':
        return { ...baseProps, roughness: 0.15, metalness: 0.08 };
      case 'butcher-block':
        return { ...baseProps, roughness: 0.7, metalness: 0.0 };
      case 'stainless-steel':
        return { ...baseProps, roughness: 0.15, metalness: 0.9 };
      case 'concrete':
        return { ...baseProps, roughness: 0.8, metalness: 0.0 };
      default:
        return baseProps;
    }
  }, [countertop.material, countertop.color]);

  if (baseCabinets.length === 0) return null;

  const thickness = cmToThree(countertop.thickness);
  const overhangFront = cmToThree(countertop.overhangFront);
  const overhangSide = cmToThree(countertop.overhangSides);

  return (
    <group>
      {baseCabinets.map((cab) => {
        const w = cmToThree(cab.width) + overhangSide * 2;
        const d = cmToThree(cab.depth) + overhangFront;
        const toeKick = cab.toeKickHeight ? cmToThree(cab.toeKickHeight) : 0;
        const cabTopY = toeKick + cmToThree(cab.height);
        const px = cmToThree(cab.position.x);
        const pz = cmToThree(cab.position.z) + overhangFront / 2;

        return (
          <mesh
            key={`ct-${cab.id}`}
            position={[px, cabTopY + thickness / 2, pz]}
            rotation={[0, cab.rotation, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[w, thickness, d]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
        );
      })}

      {/* Backsplash */}
      {countertop.backsplashHeight !== 'none' && baseCabinets.map((cab) => {
        const bsHeight = countertop.backsplashHeight === '10cm' ? 0.1
          : countertop.backsplashHeight === '15cm' ? 0.15
          : 0.6;
        const w = cmToThree(cab.width);
        const toeKick = cab.toeKickHeight ? cmToThree(cab.toeKickHeight) : 0;
        const cabTopY = toeKick + cmToThree(cab.height) + thickness;
        const px = cmToThree(cab.position.x);
        const d = cmToThree(cab.depth);
        const pz = cmToThree(cab.position.z) - d / 2 + 0.005;

        return (
          <mesh
            key={`bs-${cab.id}`}
            position={[px, cabTopY + bsHeight / 2, pz]}
            rotation={[0, cab.rotation, 0]}
            castShadow
          >
            <boxGeometry args={[w, bsHeight, 0.01]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
        );
      })}
    </group>
  );
}
