'use client';

import React, { useMemo, useRef } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import type { Cabinet as CabinetType, DoorStyle } from '@/types/kitchen';
import { cmToThree } from '@/lib/utils';
import { useKitchenStore } from '@/stores/kitchenStore';
import Handle from './Handle';
import * as THREE from 'three';

interface CabinetMeshProps {
  cabinet: CabinetType;
}

function DoorPanel({
  width,
  height,
  depth,
  doorStyle,
  doorColor,
  hingeSide,
}: {
  width: number;
  height: number;
  depth: number;
  doorStyle: DoorStyle;
  doorColor: string;
  hingeSide: 'left' | 'right';
}) {
  const panelThickness = 0.018;
  const inset = doorStyle === 'shaker' ? 0.015 : doorStyle === 'raised-panel' ? 0.012 : 0;

  return (
    <group position={[0, 0, depth / 2 + panelThickness / 2]}>
      {/* Door base panel */}
      <mesh castShadow>
        <boxGeometry args={[width - 0.004, height - 0.004, panelThickness]} />
        <meshStandardMaterial color={doorColor} roughness={0.5} metalness={0.05} />
      </mesh>

      {/* Shaker / raised panel frame */}
      {(doorStyle === 'shaker' || doorStyle === 'raised-panel') && (
        <>
          {/* Inner recessed panel */}
          <mesh position={[0, 0, -0.002]}>
            <boxGeometry args={[width - inset * 2 - 0.004, height - inset * 2 - 0.004, panelThickness + 0.001]} />
            <meshStandardMaterial
              color={doorColor}
              roughness={0.6}
              metalness={0.03}
            />
          </mesh>
          {/* Frame lines (grooves) - using thin boxes as visual grooves */}
          {['top', 'bottom', 'left', 'right'].map((side) => {
            const isHorizontal = side === 'top' || side === 'bottom';
            const pos: [number, number, number] = isHorizontal
              ? [0, side === 'top' ? (height / 2 - inset - 0.002) : -(height / 2 - inset - 0.002), panelThickness / 2 + 0.001]
              : [side === 'left' ? -(width / 2 - inset - 0.002) : (width / 2 - inset - 0.002), 0, panelThickness / 2 + 0.001];
            const size: [number, number, number] = isHorizontal
              ? [width - inset * 2, 0.002, 0.001]
              : [0.002, height - inset * 2, 0.001];
            return (
              <mesh key={side} position={pos}>
                <boxGeometry args={size} />
                <meshStandardMaterial color={new THREE.Color(doorColor).multiplyScalar(0.85).getHexString()} roughness={0.7} />
              </mesh>
            );
          })}
        </>
      )}

      {/* Glass for glass doors */}
      {doorStyle === 'glass' && (
        <mesh position={[0, 0, -0.002]}>
          <boxGeometry args={[width - 0.04, height - 0.04, 0.003]} />
          <meshStandardMaterial color="#88aacc" transparent opacity={0.3} roughness={0.05} metalness={0.1} />
        </mesh>
      )}
    </group>
  );
}

function DrawerFront({
  width,
  height,
  depth,
  doorStyle,
  doorColor,
  yOffset,
}: {
  width: number;
  height: number;
  depth: number;
  doorStyle: DoorStyle;
  doorColor: string;
  yOffset: number;
}) {
  const panelThickness = 0.018;

  return (
    <group position={[0, yOffset, depth / 2 + panelThickness / 2]}>
      <mesh castShadow>
        <boxGeometry args={[width - 0.004, height - 0.006, panelThickness]} />
        <meshStandardMaterial color={doorColor} roughness={0.5} metalness={0.05} />
      </mesh>
      {doorStyle === 'shaker' && (
        <mesh position={[0, 0, 0.002]}>
          <boxGeometry args={[width - 0.04, height - 0.025, 0.003]} />
          <meshStandardMaterial
            color={new THREE.Color(doorColor).multiplyScalar(0.92).getHexString()}
            roughness={0.6}
          />
        </mesh>
      )}
    </group>
  );
}

export default function Cabinet({ cabinet }: CabinetMeshProps) {
  const meshRef = useRef<THREE.Group>(null);
  const selectedId = useKitchenStore((s) => s.selectedId);
  const setSelectedId = useKitchenStore((s) => s.setSelectedId);

  const isSelected = selectedId === cabinet.id;

  const w = cmToThree(cabinet.width);
  const h = cmToThree(cabinet.height);
  const d = cmToThree(cabinet.depth);
  const toeKick = cabinet.toeKickHeight ? cmToThree(cabinet.toeKickHeight) : 0;
  const panelThickness = 0.018;

  // Calculate Y position based on category
  const yPos = useMemo(() => {
    if (cabinet.category === 'base') {
      return toeKick + h / 2;
    }
    if (cabinet.category === 'wall') {
      const mountH = cabinet.mountingHeight ? cmToThree(cabinet.mountingHeight) : 1.45;
      return mountH + h / 2;
    }
    // Tall cabinet
    return h / 2;
  }, [cabinet.category, h, toeKick, cabinet.mountingHeight]);

  const px = cmToThree(cabinet.position.x);
  const pz = cmToThree(cabinet.position.z);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setSelectedId(cabinet.id);
  };

  const isDrawerType = cabinet.type === 'drawer-2' || cabinet.type === 'drawer-3' || cabinet.type === 'drawer-4';
  const drawerCount = cabinet.type === 'drawer-2' ? 2 : cabinet.type === 'drawer-3' ? 3 : cabinet.type === 'drawer-4' ? 4 : 0;

  return (
    <group
      ref={meshRef}
      position={[px, yPos, pz]}
      rotation={[0, cabinet.rotation, 0]}
      onClick={handleClick}
    >
      {/* Cabinet body (box) */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={cabinet.bodyColor} roughness={0.7} metalness={0.03} />
      </mesh>

      {/* Toe kick for base cabinets */}
      {cabinet.category === 'base' && toeKick > 0 && (
        <mesh position={[0, -h / 2 - toeKick / 2, 0.01]} castShadow>
          <boxGeometry args={[w - 0.02, toeKick, d - 0.04]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>
      )}

      {/* Door / Drawer fronts */}
      {cabinet.doorStyle !== 'open' && !isDrawerType && (
        <>
          <DoorPanel
            width={w}
            height={h}
            depth={d}
            doorStyle={cabinet.doorStyle}
            doorColor={cabinet.doorColor}
            hingeSide={cabinet.hingeSide}
          />
          {/* Handle */}
          <Handle
            style={cabinet.handleStyle}
            color={cabinet.handleColor}
            width={w}
            position={[
              cabinet.hingeSide === 'left' ? w / 2 - 0.03 : -w / 2 + 0.03,
              0,
              d / 2 + panelThickness + 0.01,
            ]}
          />
        </>
      )}

      {/* Drawers */}
      {isDrawerType && (
        <>
          {Array.from({ length: drawerCount }).map((_, i) => {
            const drawerH = h / drawerCount;
            const yOff = h / 2 - drawerH / 2 - i * drawerH;
            return (
              <group key={i}>
                <DrawerFront
                  width={w}
                  height={drawerH}
                  depth={d}
                  doorStyle={cabinet.doorStyle}
                  doorColor={cabinet.doorColor}
                  yOffset={yOff}
                />
                <Handle
                  style={cabinet.handleStyle}
                  color={cabinet.handleColor}
                  width={w}
                  position={[0, yOff, d / 2 + panelThickness + 0.01]}
                />
              </group>
            );
          })}
        </>
      )}

      {/* Open shelves */}
      {cabinet.doorStyle === 'open' && (
        <>
          {[0.33, 0.66].map((frac) => (
            <mesh key={frac} position={[0, h * (frac - 0.5), 0]}>
              <boxGeometry args={[w - panelThickness * 2, panelThickness, d - 0.01]} />
              <meshStandardMaterial color={cabinet.bodyColor} roughness={0.7} />
            </mesh>
          ))}
        </>
      )}

      {/* Selection outline */}
      {isSelected && (
        <mesh>
          <boxGeometry args={[w + 0.02, h + 0.02, d + 0.02]} />
          <meshBasicMaterial color="#C8956C" wireframe transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}
