'use client';

import React, { useMemo } from 'react';
import type { HandleStyle } from '@/types/kitchen';

interface HandleProps {
  style: HandleStyle;
  color: string;
  width: number;
  position: [number, number, number];
}

export default function Handle({ style, color, width, position }: HandleProps) {
  const metalProps = useMemo(() => ({
    color,
    metalness: 0.9,
    roughness: 0.2,
  }), [color]);

  if (style === 'handleless') return null;

  return (
    <group position={position}>
      {style === 'bar' && (
        <group>
          {/* Bar handle */}
          <mesh>
            <cylinderGeometry args={[0.005, 0.005, width * 0.4, 8]} />
            <meshStandardMaterial {...metalProps} />
          </mesh>
          {/* Mounting brackets */}
          <mesh position={[0, -width * 0.18, 0]}>
            <cylinderGeometry args={[0.004, 0.004, 0.02, 8]} />
            <meshStandardMaterial {...metalProps} />
          </mesh>
          <mesh position={[0, width * 0.18, 0]}>
            <cylinderGeometry args={[0.004, 0.004, 0.02, 8]} />
            <meshStandardMaterial {...metalProps} />
          </mesh>
        </group>
      )}

      {style === 'knob' && (
        <mesh>
          <sphereGeometry args={[0.015, 16, 16]} />
          <meshStandardMaterial {...metalProps} />
        </mesh>
      )}

      {style === 'cup-pull' && (
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <torusGeometry args={[0.025, 0.004, 8, 16, Math.PI]} />
            <meshStandardMaterial {...metalProps} />
          </mesh>
        </group>
      )}

      {style === 'edge-pull' && (
        <mesh>
          <boxGeometry args={[0.003, width * 0.3, 0.015]} />
          <meshStandardMaterial {...metalProps} />
        </mesh>
      )}
    </group>
  );
}
