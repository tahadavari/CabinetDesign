import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

export function clampValue(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function cmToThree(cm: number): number {
  return cm * 0.01;
}

export function threeToCm(threeUnits: number): number {
  return threeUnits * 100;
}

export function formatCm(cm: number): string {
  if (cm >= 100) {
    const m = Math.floor(cm / 100);
    const remainder = cm % 100;
    return remainder === 0 ? `${m}m` : `${m}m ${remainder}cm`;
  }
  return `${cm}cm`;
}
