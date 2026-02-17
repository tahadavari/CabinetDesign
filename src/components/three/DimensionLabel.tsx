'use client';

import React from 'react';
import { Text, Line } from '@react-three/drei';
import { formatCm } from '@/lib/utils';

interface DimensionLabelProps {
  start: [number, number, number];
  end: [number, number, number];
  valueCm: number;
  offset?: number;
  color?: string;
}

export default function DimensionLabel({
  start,
  end,
  valueCm,
  offset = 0.05,
  color = '#C8956C',
}: DimensionLabelProps) {
  const midX = (start[0] + end[0]) / 2;
  const midY = (start[1] + end[1]) / 2 + offset;
  const midZ = (start[2] + end[2]) / 2;

  return (
    <group>
      {/* Dimension line */}
      <Line
        points={[start, end]}
        color={color}
        lineWidth={1}
        dashed
        dashSize={0.02}
        gapSize={0.01}
      />

      {/* End caps */}
      {[start, end].map((point, i) => (
        <mesh key={i} position={point}>
          <sphereGeometry args={[0.005, 8, 8]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}

      {/* Label */}
      <Text
        position={[midX, midY, midZ]}
        fontSize={0.03}
        color={color}
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.002}
        outlineColor="#000000"
      >
        {formatCm(valueCm)}
      </Text>
    </group>
  );
}
