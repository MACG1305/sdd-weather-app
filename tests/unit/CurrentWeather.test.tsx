import { cleanup, render, screen } from '@testing-library/react';
import { CloudSun, Thermometer } from 'lucide-react';
import { afterEach, describe, expect, it } from 'vitest';
import CurrentWeather from '../../src/components/CurrentWeather';
import { convertTemperature, formatTemperature } from '../../src/lib/temperature';
import { getWeatherCondition } from '../../src/lib/weatherCodes';
import { mockWeatherData } from '../../src/mocks/weather';

afterEach(cleanup);

describe('temperature', () => {
  it('converte nos dois sentidos sem arredondar os dados', () => {
    expect(convertTemperature(0, 'celsius', 'fahrenheit')).toBe(32);
    expect(convertTemperature(20, 'celsius', 'fahrenheit')).toBe(68);
    expect(convertTemperature(-40, 'celsius', 'fahrenheit')).toBe(-40);
    expect(convertTemperature(68, 'fahrenheit', 'celsius')).toBe(20);
    expect(convertTemperature(22.4, 'celsius', 'fahrenheit')).toBeCloseTo(72.32);
    expect(convertTemperature(22.4, 'celsius', 'celsius')).toBe(22.4);
    expect(formatTemperature(22.4, 'celsius')).toBe('22 \u00b0C');
    expect(formatTemperature(22.4, 'fahrenheit')).toBe('72 \u00b0F');
  });

  it.each([
    undefined,
    Number.NaN,
    Number.POSITIVE_INFINITY,
  ])('preserva ausencia ou valor invalido: %j', (value) => {
    expect(convertTemperature(value, 'celsius', 'fahrenheit')).toBeUndefined();
    expect(formatTemperature(value, 'fahrenheit')).toBe('Indispon\u00edvel');
  });
});

describe('weatherCodes', () => {
  it('fornece rotulo pt-BR e icone para o codigo conhecido', () => {
    expect(getWeatherCondition(2)).toEqual({ label: 'Parcialmente nublado', Icon: CloudSun });
  });

  it.each([undefined, 1000, 2.5, Number.NaN])('trata codigo desconhecido: %j', (code) => {
    expect(getWeatherCondition(code)).toEqual({
      label: 'Condi\u00e7\u00e3o indispon\u00edvel',
      Icon: Thermometer,
    });
  });
});

describe('CurrentWeather', () => {
  it('exibe localidade, temperatura, condicao, referencia e metricas', () => {
    render(
      <CurrentWeather
        city={mockWeatherData.city}
        current={{ ...mockWeatherData.current, pressureHpa: 1013.2 }}
        unit="celsius"
      />,
    );

    expect(screen.getByRole('region', { name: 'S\u00e3o Paulo' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'S\u00e3o Paulo' })).toBeInTheDocument();
    expect(screen.getByText('S\u00e3o Paulo, Brasil')).toBeInTheDocument();
    expect(screen.getByText('22 \u00b0C')).toBeInTheDocument();
    expect(screen.getByText('Parcialmente nublado')).toBeInTheDocument();
    expect(screen.getByText('Sensa\u00e7\u00e3o t\u00e9rmica: 23 \u00b0C')).toBeInTheDocument();
    expect(screen.getByText('2026-10-07T14:00')).toHaveAttribute('datetime', '2026-10-07T14:00');
    expect(screen.getByText('61 %')).toBeInTheDocument();
    expect(screen.getByText('12,6 km/h')).toBeInTheDocument();
    expect(screen.getByText('0 mm')).toBeInTheDocument();
    expect(screen.getByText('1.013,2 hPa')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('atualiza temperaturas conforme a unidade sem modificar metricas ou dados', () => {
    const current = { ...mockWeatherData.current, temperatureC: 20, apparentTemperatureC: 21 };
    const { rerender } = render(
      <CurrentWeather city={mockWeatherData.city} current={current} unit="celsius" />,
    );
    expect(screen.getByText('20 \u00b0C')).toBeInTheDocument();

    rerender(<CurrentWeather city={mockWeatherData.city} current={current} unit="fahrenheit" />);
    expect(screen.getByText('68 \u00b0F')).toBeInTheDocument();
    expect(screen.getByText('Sensa\u00e7\u00e3o t\u00e9rmica: 70 \u00b0F')).toBeInTheDocument();
    expect(screen.getByText('61 %')).toBeInTheDocument();
    expect(screen.getByText('12,6 km/h')).toBeInTheDocument();
    expect(screen.getByText('0 mm')).toBeInTheDocument();
    expect(current.temperatureC).toBe(20);
    expect(screen.getByRole('heading', { name: 'S\u00e3o Paulo' })).toBeInTheDocument();
  });

  it('mostra ausencias sem inventar zero e aceita cidade sem regiao', () => {
    const { admin1: _admin1, ...city } = mockWeatherData.city;
    render(<CurrentWeather city={city} current={{}} unit="fahrenheit" />);

    expect(screen.getByText('Brasil')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Dados atuais incompletos');
    expect(screen.getByText('Condi\u00e7\u00e3o indispon\u00edvel')).toBeInTheDocument();
    expect(screen.getAllByText('Indispon\u00edvel')).toHaveLength(5);
    expect(screen.queryByText('0 mm')).not.toBeInTheDocument();
    expect(screen.queryByText('32 \u00b0F')).not.toBeInTheDocument();
  });

  it('mostra pressao ausente como indisponivel sem invalidar campos presentes', () => {
    render(
      <CurrentWeather
        city={mockWeatherData.city}
        current={mockWeatherData.current}
        unit="celsius"
      />,
    );

    expect(screen.getByText('Press\u00e3o').nextElementSibling).toHaveTextContent(
      'Indispon\u00edvel',
    );
    expect(screen.getByText('22 \u00b0C')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('sinaliza condicao desconhecida sem esconder as outras metricas', () => {
    render(
      <CurrentWeather
        city={mockWeatherData.city}
        current={{ ...mockWeatherData.current, weatherCode: 1000 }}
        unit="celsius"
      />,
    );

    expect(screen.getByText('Condi\u00e7\u00e3o indispon\u00edvel')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Dados atuais incompletos');
    expect(screen.getByText('61 %')).toBeInTheDocument();
  });
});
