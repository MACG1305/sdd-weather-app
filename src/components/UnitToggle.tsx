import type { Unit } from '../types/weather';

export interface UnitToggleProps {
  unit: Unit;
  onChange: (unit: Unit) => void;
}

export default function UnitToggle({ unit, onChange }: UnitToggleProps) {
  const buttonClassName =
    'min-h-11 w-14 rounded-md text-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400';

  return (
    <div
      role="group"
      aria-label="Unidade de temperatura"
      className="inline-flex gap-1 rounded-lg border border-white/10 bg-white/5 p-1 font-sans backdrop-blur-md"
    >
      <button
        type="button"
        aria-label={'Celsius (\u00b0C)'}
        aria-pressed={unit === 'celsius'}
        onClick={() => onChange('celsius')}
        className={`${buttonClassName} ${unit === 'celsius' ? 'bg-accent-600 font-semibold' : 'bg-white/5 hover:bg-white/10'}`}
      >
        {'\u00b0C'}
      </button>
      <button
        type="button"
        aria-label={'Fahrenheit (\u00b0F)'}
        aria-pressed={unit === 'fahrenheit'}
        onClick={() => onChange('fahrenheit')}
        className={`${buttonClassName} ${unit === 'fahrenheit' ? 'bg-accent-600 font-semibold' : 'bg-white/5 hover:bg-white/10'}`}
      >
        {'\u00b0F'}
      </button>
    </div>
  );
}
