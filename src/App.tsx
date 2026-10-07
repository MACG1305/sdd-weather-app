import { CloudSun } from 'lucide-react';
import { useRef, useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import UnitToggle from './components/UnitToggle';
import { type MockWeatherStatus, useMockWeather } from './hooks/useMockWeather';
import { mockWeatherData } from './mocks/weather';
import type { Unit } from './types/weather';

export default function App() {
  const mainRef = useRef<HTMLElement>(null);
  const [unit, setUnit] = useState<Unit>('celsius');
  const { status, setStatus, search, retry } = useMockWeather();

  return (
    <div className="min-h-screen bg-gradient-to-b from-night-800 to-night-900 font-sans text-white">
      <a
        href="#main-content"
        className="sr-only rounded-lg bg-night-800 px-4 py-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:outline focus:outline-2 focus:outline-accent-400"
      >
        {'Ir para o conte\u00fado'}
      </a>
      <header className="border-b border-white/10 bg-night-900/50">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[auto_auto_minmax(0,1fr)] lg:gap-8">
          <div className="flex min-w-0 items-center gap-2">
            <CloudSun aria-hidden="true" className="h-7 w-7 shrink-0 text-sun" />
            <h1 className="break-words text-lg font-semibold sm:text-xl">Weather App</h1>
          </div>
          <div className="justify-self-end">
            <UnitToggle unit={unit} onChange={setUnit} />
          </div>
          <div className="col-span-2 min-w-0 lg:col-span-1">
            <SearchBar onSearch={search} disabled={status === 'loading'} />
          </div>
        </div>
      </header>

      <main
        ref={mainRef}
        id="main-content"
        tabIndex={-1}
        className="mx-auto max-w-6xl space-y-8 px-4 py-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 sm:px-6 sm:py-10"
      >
        <p aria-live="polite" aria-atomic="true" className="sr-only">
          {status === 'success'
            ? `Dados de exemplo de ${mockWeatherData.city.name} carregados.`
            : ''}
        </p>
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5">
          <p className="text-sm text-white/70">Dados de exemplo</p>
          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="preview-state" className="text-sm text-white/70">
              Estado da consulta
            </label>
            <select
              id="preview-state"
              value={status}
              onChange={(event) => setStatus(event.target.value as MockWeatherStatus)}
              className="min-h-11 max-w-full rounded-lg border border-white/40 bg-night-800 px-3 py-2 text-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400"
            >
              <option value="idle">Inicial</option>
              <option value="loading">Carregando</option>
              <option value="empty">Sem resultados</option>
              <option value="error">Erro</option>
              <option value="success">Resultado</option>
            </select>
          </div>
        </div>

        {status === 'idle' && (
          <EmptyState title="Nenhuma cidade selecionada" hint={'S\u00e3o Paulo, Brasil'} />
        )}
        {status === 'loading' && <LoadingState message={'Carregando previs\u00e3o...'} />}
        {status === 'empty' && <EmptyState />}
        {status === 'error' && (
          <ErrorState
            message={'N\u00e3o foi poss\u00edvel carregar os dados meteorol\u00f3gicos.'}
            onRetry={() => {
              mainRef.current?.focus();
              retry();
            }}
          />
        )}
        {status === 'success' && (
          <div className="space-y-10">
            <CurrentWeather
              city={mockWeatherData.city}
              current={mockWeatherData.current}
              unit={unit}
            />
            <div className="border-t border-white/10 pt-8">
              <ForecastList forecast={mockWeatherData.forecast} unit={unit} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
