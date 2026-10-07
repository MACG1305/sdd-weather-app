import { useId } from 'react';
import { formatTemperature } from '../lib/temperature';
import { getWeatherCondition } from '../lib/weatherCodes';
import type { City, CurrentWeather as CurrentWeatherData, Unit } from '../types/weather';

export interface CurrentWeatherProps {
  city: City;
  current: CurrentWeatherData;
  unit: Unit;
}

function formatMeasurement(value: number | undefined, suffix: string): string {
  if (value === undefined || !Number.isFinite(value)) return 'Indispon\u00edvel';
  return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(value)} ${suffix}`;
}

export default function CurrentWeather({ city, current, unit }: CurrentWeatherProps) {
  const titleId = useId();
  const { label, Icon } = getWeatherCondition(current.weatherCode);
  const temperature = formatTemperature(current.temperatureC, unit);
  const incomplete =
    temperature === 'Indispon\u00edvel' ||
    label === 'Condi\u00e7\u00e3o indispon\u00edvel' ||
    !current.referenceTime;
  const metrics = [
    { label: 'Umidade', value: formatMeasurement(current.relativeHumidity, '%') },
    { label: 'Vento', value: formatMeasurement(current.windSpeedKmh, 'km/h') },
    { label: 'Precipita\u00e7\u00e3o', value: formatMeasurement(current.precipitationMm, 'mm') },
    { label: 'Press\u00e3o', value: formatMeasurement(current.pressureHpa, 'hPa') },
  ];

  return (
    <section aria-labelledby={titleId} className="min-w-0 space-y-6 font-sans text-white">
      <header>
        <h2 id={titleId} className="break-words text-2xl font-semibold sm:text-3xl">
          {city.name}
        </h2>
        <p className="mt-1 break-words text-sm text-white/70">
          {[city.admin1, city.country].filter(Boolean).join(', ')}
        </p>
      </header>

      {incomplete && (
        <p role="status" className="text-sm text-sun">
          Dados atuais incompletos
        </p>
      )}

      <div className="flex min-w-0 flex-wrap items-center gap-6">
        <Icon aria-hidden="true" className="h-20 w-20 shrink-0 text-sun sm:h-24 sm:w-24" />
        <div className="min-w-0 space-y-2">
          <dl>
            <dt className="sr-only">Temperatura</dt>
            <dd
              className={
                temperature === 'Indispon\u00edvel'
                  ? 'text-2xl font-semibold'
                  : 'break-words text-6xl font-semibold sm:text-7xl'
              }
            >
              {temperature}
            </dd>
          </dl>
          <p className="text-lg">{label}</p>
          <p className="text-sm text-white/70">
            {'Sensa\u00e7\u00e3o t\u00e9rmica: '}
            {formatTemperature(current.apparentTemperatureC, unit)}
          </p>
        </div>
      </div>

      <p className="break-words text-sm text-white/70">
        {'Refer\u00eancia local: '}
        {current.referenceTime ? (
          <time dateTime={current.referenceTime}>{current.referenceTime}</time>
        ) : (
          'Indispon\u00edvel'
        )}
      </p>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="min-w-0 rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur-md sm:p-4"
          >
            <dt className="break-words text-sm text-white/70">{metric.label}</dt>
            <dd className="mt-2 break-words text-base font-semibold">{metric.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
