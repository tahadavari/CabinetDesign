import type { ApplianceType } from '@/types/kitchen';

export interface AppliancePreset {
  type: ApplianceType;
  name: string;
  description: string;
  defaultWidth: number;
  defaultHeight: number;
  defaultDepth: number;
  placement: 'freestanding' | 'built-in' | 'countertop' | 'wall-mounted';
  color: string;
}

export const APPLIANCE_PRESETS: AppliancePreset[] = [
  {
    type: 'refrigerator',
    name: 'Refrigerator',
    description: 'Standard freestanding fridge',
    defaultWidth: 60,
    defaultHeight: 180,
    defaultDepth: 65,
    placement: 'freestanding',
    color: '#C0C0C0',
  },
  {
    type: 'range-4',
    name: 'Range (4-Burner)',
    description: '60cm 4-burner range/stove',
    defaultWidth: 60,
    defaultHeight: 85,
    defaultDepth: 60,
    placement: 'built-in',
    color: '#A0A0A0',
  },
  {
    type: 'range-5',
    name: 'Range (5-Burner)',
    description: '90cm 5-burner range/stove',
    defaultWidth: 90,
    defaultHeight: 85,
    defaultDepth: 60,
    placement: 'built-in',
    color: '#A0A0A0',
  },
  {
    type: 'built-in-oven',
    name: 'Built-in Oven',
    description: 'Wall-mounted built-in oven',
    defaultWidth: 60,
    defaultHeight: 60,
    defaultDepth: 55,
    placement: 'built-in',
    color: '#333333',
  },
  {
    type: 'microwave',
    name: 'Microwave',
    description: 'Countertop or built-in microwave',
    defaultWidth: 50,
    defaultHeight: 30,
    defaultDepth: 35,
    placement: 'countertop',
    color: '#444444',
  },
  {
    type: 'dishwasher',
    name: 'Dishwasher',
    description: 'Standard built-in dishwasher',
    defaultWidth: 60,
    defaultHeight: 82,
    defaultDepth: 58,
    placement: 'built-in',
    color: '#C0C0C0',
  },
  {
    type: 'sink-single',
    name: 'Single Bowl Sink',
    description: 'Single bowl kitchen sink',
    defaultWidth: 50,
    defaultHeight: 20,
    defaultDepth: 40,
    placement: 'built-in',
    color: '#B8B8B8',
  },
  {
    type: 'sink-double',
    name: 'Double Bowl Sink',
    description: 'Double bowl kitchen sink',
    defaultWidth: 80,
    defaultHeight: 20,
    defaultDepth: 45,
    placement: 'built-in',
    color: '#B8B8B8',
  },
  {
    type: 'range-hood-wall',
    name: 'Wall Range Hood',
    description: 'Wall-mounted range hood',
    defaultWidth: 60,
    defaultHeight: 50,
    defaultDepth: 45,
    placement: 'wall-mounted',
    color: '#A8A8A8',
  },
  {
    type: 'washing-machine',
    name: 'Washing Machine',
    description: 'Front-loading washing machine',
    defaultWidth: 60,
    defaultHeight: 85,
    defaultDepth: 60,
    placement: 'built-in',
    color: '#E0E0E0',
  },
];
