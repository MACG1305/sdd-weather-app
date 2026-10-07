import { useId } from 'react';
import { formatTemperature } from '../lib/temperature';
import { getWeatherCondition } from '../lib/weatherCodes';
import type { ForecastDay, Unit } from '../types/weather';

export interface ForecastListProps {
  forecast: ForecastDay[];
  unit: Unit;
}

function formatDate(date: string): string {
  const value = new Date(`${date}T00:00:00Z`);
  if (!Number.isFinite(value.getTime())) return 'Data indispon\u00edvel';
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    timeZone: 'UTC',
  }).format(value);
}

export default function ForecastList({ forecast, unit }: ForecastListProps) {
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className="min-w-0 space-y-4 text-white">
      <h2 id={titleId} className="text-xl font-semibold">
        {'Previs\u00e3o de 5 dias'}
      </h2>
      <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {forecast.map((day) => {
          const { label, Icon } = getWeatherCondition(day.weatherCode);
          const minimum = formatTemperature(day.minimumC, unit);
          const maximum = formatTemperature(day.maximumC, unit);
          const incomplete =
            label === 'Condi\u00e7\u00e3o indispon\u00edvel' ||
            minimum === 'Indispon\u00edvel' ||
            maximum === 'Indispon\u00edvel';
          const probability = day.precipitationProbability;

          return (
            <li
              key={day.date}
              className="min-w-0 space-y-4 rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur-md sm:p-4"
            >
              <time dateTime={day.date} className="block break-words text-sm font-medium">
                {formatDate(day.date)}
              </time>
              <Icon aria-hidden="true" className="h-10 w-10 text-sun" />
              <p className="min-h-10 break-words text-sm text-white/80">
                {incomplete ? 'Previs\u00e3o indispon\u00edvel' : label}
              </p>
              <dl className="grid grid-cols-2 gap-2">
                <div className="min-w-0">
                  <dt className="break-words text-xs text-white/70">{'M\u00ednima'}</dt>
                  <dd className="mt-1 break-words text-sm font-semibold">{minimum}</dd>
                </div>
                <div className="min-w-0">
                  <dt className="break-words text-xs text-white/70">{'M\u00e1xima'}</dt>
                  <dd className="mt-1 break-words text-sm font-semibold">{maximum}</dd>
                </div>
                <div className="col-span-2 border-t border-white/10 pt-3">
                  <dt className="text-xs text-white/70">Chuva</dt>
                  <dd className="mt-1 text-sm">
                    {probability !== undefined && Number.isFinite(probability)
                      ? `${probability} %`
                      : 'Indispon\u00edvel'}
                  </dd>
                </div>
              </dl>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
