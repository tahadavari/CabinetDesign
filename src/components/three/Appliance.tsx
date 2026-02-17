'use client';

import React, { useMemo } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import type { Appliance as ApplianceType } from '@/types/kitchen';
import { cmToThree } from '@/lib/utils';
import { useKitchenStore } from '@/stores/kitchenStore';

interface ApplianceMeshProps {
  appliance: ApplianceType;
}

const APPLIANCE_LABELS: Record<string, string> = {
  'refrigerator': 'Fridge',
  'range-4': 'Range',
  'range-5': 'Range',
  'built-in-oven': 'Oven',
  'microwave': 'Micro',
  'dishwasher': 'DW',
  'washing-machine': 'Wash',
  'sink-single': 'Sink',
  'sink-double': 'Sink',
  'range-hood-wall': 'Hood',
  'range-hood-integrated': 'Hood',
};

export default function Appliance({ appliance }: ApplianceMeshProps) {
  const selectedId = useKitchenStore((s) => s.selectedId);
  const setSelectedId = useKitchenStore((s) => s.setSelectedId);
  const isSelected = selectedId === appliance.id;

  const w = cmToThree(appliance.width);
  const h = cmToThree(appliance.height);
  const d = cmToThree(appliance.depth);
  const px = cmToThree(appliance.position.x);
  const pz = cmToThree(appliance.position.z);

  const yPos = useMemo(() => {
    if (appliance.type === 'range-hood-wall' || appliance.type === 'range-hood-integrated') {
      return cmToThree(160) + h / 2;
    }
    if (appliance.type === 'built-in-oven') {
      return cmToThree(80) + h / 2;
    }
    if (appliance.type === 'microwave') {
      return cmToThree(140) + h / 2;
    }
    if (appliance.type === 'sink-single' || appliance.type === 'sink-double') {
      return cmToThree(85);
    }
    return h / 2;
  }, [appliance.type, h]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setSelectedId(appliance.id);
  };

  const label = APPLIANCE_LABELS[appliance.type] || appliance.type;

  const isSink = appliance.type === 'sink-single' || appliance.type === 'sink-double';
  const isRange = appliance.type === 'range-4' || appliance.type === 'range-5';
  const isHood = appliance.type === 'range-hood-wall' || appliance.type === 'range-hood-integrated';
  const isFridge = appliance.type === 'refrigerator';

  return (
    <group
      position={[px, yPos, pz]}
      rotation={[0, appliance.rotation, 0]}
      onClick={handleClick}
    >
      {/* Main body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={appliance.color}
          roughness={isSink ? 0.15 : 0.3}
          metalness={isSink ? 0.9 : isFridge ? 0.6 : 0.4}
        />
      </mesh>

      {/* Appliance-specific details */}
      {isSink && (
        // Sink basin
        <mesh position={[0, h / 2 - 0.01, 0]}>
          <boxGeometry args={[w - 0.04, 0.01, d - 0.06]} />
          <meshStandardMaterial color="#888" metalness={0.9} roughness={0.1} />
        </mesh>
      )}

      {isRange && (
        // Burner grates
        <>
          {[[-0.08, 0.08], [0.08, 0.08], [-0.08, -0.08], [0.08, -0.08]].map(([x, z], i) => (
            <mesh key={i} position={[x, h / 2 + 0.005, z]}>
              <cylinderGeometry args={[0.035, 0.035, 0.005, 16]} />
              <meshStandardMaterial color="#222" metalness={0.7} roughness={0.4} />
            </mesh>
          ))}
        </>
      )}

      {isHood && (
        // Hood vent opening
        <mesh position={[0, -h / 2 + 0.01, 0]}>
          <boxGeometry args={[w - 0.04, 0.005, d - 0.04]} />
          <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
        </mesh>
      )}

      {isFridge && (
        // Fridge door line + handle
        <>
          <mesh position={[0, h * 0.1, d / 2 + 0.002]}>
            <boxGeometry args={[w - 0.01, 0.003, 0.003]} />
            <meshStandardMaterial color="#999" metalness={0.7} />
          </mesh>
          <mesh position={[w / 2 - 0.03, h * 0.2, d / 2 + 0.01]}>
            <cylinderGeometry args={[0.005, 0.005, 0.2, 8]} />
            <meshStandardMaterial color="#aaa" metalness={0.9} roughness={0.15} />
          </mesh>
          <mesh position={[w / 2 - 0.03, -h * 0.2, d / 2 + 0.01]}>
            <cylinderGeometry args={[0.005, 0.005, 0.15, 8]} />
            <meshStandardMaterial color="#aaa" metalness={0.9} roughness={0.15} />
          </mesh>
        </>
      )}

      {/* Label */}
      <Text
        position={[0, 0, d / 2 + 0.025]}
        fontSize={0.04}
        color="#666"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>

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
