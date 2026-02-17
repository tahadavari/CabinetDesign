'use client';

import React from 'react';
import { useKitchenStore } from '@/stores/kitchenStore';
import Room from './Room';
import Cabinet from './Cabinet';
import Appliance from './Appliance';
import Countertop from './Countertop';
import Island from './Island';
import Lighting from './Lighting';
import DimensionLabel from './DimensionLabel';
import { cmToThree } from '@/lib/utils';

export default function KitchenScene() {
  const cabinets = useKitchenStore((s) => s.cabinets);
  const appliances = useKitchenStore((s) => s.appliances);
  const showMeasurements = useKitchenStore((s) => s.showMeasurements);
  const walls = useKitchenStore((s) => s.walls);
  const setSelectedId = useKitchenStore((s) => s.setSelectedId);

  const handleBackgroundClick = () => {
    setSelectedId(null);
  };

  return (
    <group>
      <Lighting />
      <Room />

      {/* Cabinets */}
      {cabinets.map((cabinet) => (
        <Cabinet key={cabinet.id} cabinet={cabinet} />
      ))}

      {/* Countertops (auto-generated on base cabinets) */}
      <Countertop />

      {/* Appliances */}
      {appliances.map((appliance) => (
        <Appliance key={appliance.id} appliance={appliance} />
      ))}

      {/* Island */}
      <Island />

      {/* Measurements */}
      {showMeasurements && walls.map((wall) => {
        const w = cmToThree(wall.length);
        const px = cmToThree(wall.position.x);
        const pz = cmToThree(wall.position.z);
        const cos = Math.cos(wall.rotation);
        const sin = Math.sin(wall.rotation);
        const halfW = w / 2;

        const start: [number, number, number] = [
          px - halfW * cos,
          0.02,
          pz - halfW * sin,
        ];
        const end: [number, number, number] = [
          px + halfW * cos,
          0.02,
          pz + halfW * sin,
        ];

        return (
          <DimensionLabel
            key={`dim-${wall.id}`}
            start={start}
            end={end}
            valueCm={wall.length}
            offset={0.08}
          />
        );
      })}

      {/* Clickable background plane for deselection */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        onClick={handleBackgroundClick}
      >
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  );
}
