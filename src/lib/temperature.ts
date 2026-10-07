import type { Unit } from '../types/weather';

export function convertTemperature(
  value: number | undefined,
  from: Unit,
  to: Unit,
): number | undefined {
  if (value === undefined || !Number.isFinite(value)) return undefined;
  if (from === to) return value;
  return from === 'celsius' ? (value * 9) / 5 + 32 : ((value - 32) * 5) / 9;
}

export function formatTemperature(valueC: number | undefined, unit: Unit): string {
  const value = convertTemperature(valueC, 'celsius', unit);
  if (value === undefined) return 'Indispon\u00edvel';
  return `${Math.round(value)} \u00b0${unit === 'celsius' ? 'C' : 'F'}`;
}
