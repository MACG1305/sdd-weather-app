import { act, cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../../src/App';
import ForecastList from '../../src/components/ForecastList';
import { mockWeatherData } from '../../src/mocks/weather';

beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function finishLoading() {
  act(() => vi.advanceTimersByTime(600));
}

describe('App com dados mockados', () => {
  it('inicia idle com marca, busca acessivel e Celsius', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Weather App' })).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'Cidade' })).toBeEnabled();
    expect(screen.getByRole('button', { name: /Celsius/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('heading', { name: 'Nenhuma cidade selecionada' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Estado da consulta' })).toHaveValue('idle');
  });

  it('busca Sao Paulo, passa por loading e converte temperaturas sem rede ou mutacao', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const originalData = structuredClone(mockWeatherData);
    render(<App />);

    await user.type(screen.getByRole('searchbox'), '  Sao Paulo  {Enter}');
    expect(screen.getByRole('status')).toHaveTextContent('Carregando previs\u00e3o...');
    expect(screen.getByRole('searchbox')).toBeDisabled();
    await user.click(screen.getByRole('button', { name: /Fahrenheit/ }));
    finishLoading();

    expect(screen.getByRole('heading', { name: 'S\u00e3o Paulo' })).toBeInTheDocument();
    expect(screen.getByText('72 \u00b0F')).toBeInTheDocument();
    const forecast = screen.getByRole('region', { name: 'Previs\u00e3o de 5 dias' });
    expect(within(forecast).getAllByRole('listitem')).toHaveLength(5);
    expect(within(forecast).getByText('61 \u00b0F')).toBeInTheDocument();
    expect(within(forecast).getByText('78 \u00b0F')).toBeInTheDocument();
    expect(screen.getByText('61 %')).toBeInTheDocument();
    expect(screen.getByText('12,6 km/h')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Celsius/ }));
    expect(screen.getByText('22 \u00b0C')).toBeInTheDocument();
    expect(within(forecast).getByText('16 \u00b0C')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('success');
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(mockWeatherData).toEqual(originalData);
  });

  it('mostra vazio para cidade sem mock e nao reapresenta dados anteriores', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);
    await user.selectOptions(screen.getByRole('combobox'), 'success');
    await user.type(screen.getByRole('searchbox'), 'Manaus{Enter}');
    expect(screen.queryByRole('region', { name: 'S\u00e3o Paulo' })).not.toBeInTheDocument();
    finishLoading();

    expect(screen.getByRole('heading', { name: 'Nenhuma cidade encontrada' })).toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toHaveValue('Manaus');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('permite inspecionar todos os estados, cancelar loading e repetir um erro', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);
    const state = screen.getByRole('combobox');

    await user.selectOptions(state, 'loading');
    expect(screen.getByRole('status')).toHaveTextContent('Carregando previs\u00e3o...');
    await user.selectOptions(state, 'error');
    finishLoading();
    expect(screen.getByRole('alert')).toHaveTextContent('N\u00e3o foi poss\u00edvel carregar');
    expect(state).toHaveValue('error');
    expect(screen.queryByRole('list')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(state).toHaveValue('loading');
    finishLoading();
    expect(state).toHaveValue('success');
    expect(screen.getByRole('heading', { name: 'S\u00e3o Paulo' })).toBeInTheDocument();

    await user.selectOptions(state, 'empty');
    expect(screen.getByRole('heading', { name: 'Nenhuma cidade encontrada' })).toBeInTheDocument();
    await user.selectOptions(state, 'idle');
    expect(screen.getByRole('heading', { name: 'Nenhuma cidade selecionada' })).toBeInTheDocument();
  });

  it('reinicia em Celsius ao montar uma nova sessao', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const { unmount } = render(<App />);
    await user.click(screen.getByRole('button', { name: /Fahrenheit/ }));
    unmount();
    render(<App />);

    expect(screen.getByRole('button', { name: /Celsius/ })).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('ForecastList', () => {
  it('preserva as cinco posicoes e sinaliza campos ausentes sem inventar zero', () => {
    const forecast = mockWeatherData.forecast.map((day, index) =>
      index === 2 ? { date: day.date } : day,
    );
    render(<ForecastList forecast={forecast} unit="fahrenheit" />);

    const days = screen.getAllByRole('listitem');
    expect(days).toHaveLength(5);
    expect(within(days[2]).getByText('Previs\u00e3o indispon\u00edvel')).toBeInTheDocument();
    expect(within(days[2]).getAllByText('Indispon\u00edvel')).toHaveLength(3);
    expect(within(days[2]).queryByText('32 \u00b0F')).not.toBeInTheDocument();
    expect(within(days[2]).getByText('sex., 09/10')).toHaveAttribute('datetime', '2026-10-09');
  });
});
