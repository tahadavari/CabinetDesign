'use client';

import React from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { useKitchenStore } from '@/stores/kitchenStore';
import { cmToThree } from '@/lib/utils';

export default function Island() {
  const island = useKitchenStore((s) => s.island);
  const countertop = useKitchenStore((s) => s.countertop);
  const selectedId = useKitchenStore((s) => s.selectedId);
  const setSelectedId = useKitchenStore((s) => s.setSelectedId);

  if (!island) return null;

  const w = cmToThree(island.width);
  const l = cmToThree(island.length);
  const h = cmToThree(island.height);
  const px = cmToThree(island.position.x);
  const pz = cmToThree(island.position.z);
  const toeKick = cmToThree(10);
  const ctThickness = cmToThree(countertop.thickness);

  const isSelected = selectedId === island.id;

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setSelectedId(island.id);
  };

  // Calculate countertop with overhangs
  const ohFront = cmToThree(island.overhangSides.front);
  const ohBack = cmToThree(island.overhangSides.back);
  const ohLeft = cmToThree(island.overhangSides.left);
  const ohRight = cmToThree(island.overhangSides.right);
  const ctW = w + ohLeft + ohRight;
  const ctL = l + ohFront + ohBack;
  const ctOffsetX = (ohRight - ohLeft) / 2;
  const ctOffsetZ = (ohFront - ohBack) / 2;

  return (
    <group position={[px, 0, pz]} onClick={handleClick}>
      {/* Island body (cabinets) */}
      <mesh position={[0, toeKick + (h - toeKick) / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h - toeKick, l]} />
        <meshStandardMaterial color="#FAFAFA" roughness={0.5} metalness={0.05} />
      </mesh>

      {/* Toe kick */}
      <mesh position={[0, toeKick / 2, 0]} castShadow>
        <boxGeometry args={[w - 0.04, toeKick, l - 0.04]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      {/* Door panels on front and back */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[0, toeKick + (h - toeKick) / 2, side * (l / 2 + 0.01)]}
          castShadow
        >
          <boxGeometry args={[w - 0.01, h - toeKick - 0.01, 0.018]} />
          <meshStandardMaterial color="#FAFAFA" roughness={0.5} metalness={0.05} />
        </mesh>
      ))}

      {/* Countertop */}
      {island.hasCountertop && (
        <mesh
          position={[ctOffsetX, h + ctThickness / 2, ctOffsetZ]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[ctW, ctThickness, ctL]} />
          <meshStandardMaterial
            color={countertop.color}
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>
      )}

      {/* Selection outline */}
      {isSelected && (
        <mesh position={[0, h / 2, 0]}>
          <boxGeometry args={[w + 0.03, h + 0.03, l + 0.03]} />
          <meshBasicMaterial color="#C8956C" wireframe transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}
