'use client';

import React, { useMemo } from 'react';
import { useKitchenStore } from '@/stores/kitchenStore';
import { cmToThree } from '@/lib/utils';
import * as THREE from 'three';

function FloorGrid({ showGrid }: { showGrid: boolean }) {
  return (
    <group>
      {/* Floor plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial
          color="#2a2520"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Grid overlay */}
      {showGrid && (
        <gridHelper
          args={[12, 60, '#444444', '#333333']}
          position={[0, 0.001, 0]}
        />
      )}
    </group>
  );
}

function WallMesh({ wall }: { wall: { id: string; length: number; height: number; thickness: number; position: { x: number; y: number; z: number }; rotation: number; hasWindow: boolean; windowConfig?: { width: number; height: number; fromFloor: number; fromLeft: number }; hasDoor: boolean; doorConfig?: { width: number; height: number; fromLeft: number } } }) {
  const w = cmToThree(wall.length);
  const h = cmToThree(wall.height);
  const t = cmToThree(wall.thickness);
  const px = cmToThree(wall.position.x);
  const py = cmToThree(wall.position.y) + h / 2;
  const pz = cmToThree(wall.position.z);

  const geometry = useMemo(() => {
    if (!wall.hasWindow && !wall.hasDoor) {
      return new THREE.BoxGeometry(w, h, t);
    }

    // Create wall with openings using shape
    const shape = new THREE.Shape();
    shape.moveTo(-w / 2, 0);
    shape.lineTo(w / 2, 0);
    shape.lineTo(w / 2, h);
    shape.lineTo(-w / 2, h);
    shape.closePath();

    if (wall.hasWindow && wall.windowConfig) {
      const wc = wall.windowConfig;
      const winW = cmToThree(wc.width);
      const winH = cmToThree(wc.height);
      const winFromFloor = cmToThree(wc.fromFloor);
      const winFromLeft = cmToThree(wc.fromLeft) - w / 2;

      const hole = new THREE.Path();
      hole.moveTo(winFromLeft, winFromFloor);
      hole.lineTo(winFromLeft + winW, winFromFloor);
      hole.lineTo(winFromLeft + winW, winFromFloor + winH);
      hole.lineTo(winFromLeft, winFromFloor + winH);
      hole.closePath();
      shape.holes.push(hole);
    }

    if (wall.hasDoor && wall.doorConfig) {
      const dc = wall.doorConfig;
      const doorW = cmToThree(dc.width);
      const doorH = cmToThree(dc.height);
      const doorFromLeft = cmToThree(dc.fromLeft) - w / 2;

      const hole = new THREE.Path();
      hole.moveTo(doorFromLeft, 0);
      hole.lineTo(doorFromLeft + doorW, 0);
      hole.lineTo(doorFromLeft + doorW, doorH);
      hole.lineTo(doorFromLeft, doorH);
      hole.closePath();
      shape.holes.push(hole);
    }

    const extrudeSettings = { depth: t, bevelEnabled: false };
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.translate(0, -h / 2, -t / 2);
    return geo;
  }, [w, h, t, wall.hasWindow, wall.hasDoor, wall.windowConfig, wall.doorConfig]);

  return (
    <mesh
      position={[px, py, pz]}
      rotation={[0, wall.rotation, 0]}
      castShadow
      receiveShadow
      geometry={geometry}
    >
      <meshStandardMaterial
        color="#e8e4de"
        roughness={0.9}
        metalness={0.0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function Room() {
  const walls = useKitchenStore((s) => s.walls);
  const showGrid = useKitchenStore((s) => s.showGrid);

  return (
    <group>
      <FloorGrid showGrid={showGrid} />
      {walls.map((wall) => (
        <WallMesh key={wall.id} wall={wall} />
      ))}
    </group>
  );
}
