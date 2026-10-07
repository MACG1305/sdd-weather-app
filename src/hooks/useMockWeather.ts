import { useEffect, useState } from 'react';
import { mockWeatherData } from '../mocks/weather';

export type MockWeatherStatus = 'idle' | 'loading' | 'empty' | 'error' | 'success';

export function useMockWeather() {
  const [status, setStatus] = useState<MockWeatherStatus>('idle');
  const [query, setQuery] = useState(mockWeatherData.city.name);

  useEffect(() => {
    if (status !== 'loading') return;

    const timer = window.setTimeout(() => {
      const matches =
        query.localeCompare(mockWeatherData.city.name, 'pt-BR', {
          sensitivity: 'base',
        }) === 0;
      setStatus(matches ? 'success' : 'empty');
    }, 600);

    return () => window.clearTimeout(timer);
  }, [status, query]);

  function search(city: string) {
    const trimmed = city.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setStatus('loading');
  }

  function retry() {
    setStatus('loading');
  }

  return { status, setStatus, search, retry };
}
