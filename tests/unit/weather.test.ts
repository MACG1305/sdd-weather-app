import { describe, expect, expectTypeOf, it } from 'vitest';
import { mockWeatherData } from '../../src/mocks/weather';
import type { City, CurrentWeather, ForecastDay, Unit, WeatherData } from '../../src/types/weather';

describe('contratos meteorologicos', () => {
  it('aceita apenas Celsius e Fahrenheit como unidades', () => {
    expectTypeOf<Unit>().toEqualTypeOf<'celsius' | 'fahrenheit'>();
  });

  it('permite campos meteorologicos e regiao ausentes sem preencher com zero', () => {
    const city: City = {
      id: 3448439,
      name: 'S\u00e3o Paulo',
      country: 'Brasil',
      latitude: -23.5475,
      longitude: -46.63611,
    };
    const current: CurrentWeather = {};
    const forecastDay: ForecastDay = { date: '2026-10-07' };
    const partialData: WeatherData = {
      city,
      timezone: 'America/Sao_Paulo',
      current,
      forecast: [forecastDay],
    };

    expect(partialData.city.admin1).toBeUndefined();
    expect(partialData.current.temperatureC).toBeUndefined();
    expect(partialData.forecast[0].minimumC).toBeUndefined();
    expect(partialData.forecast[0].maximumC).toBeUndefined();
  });
});

describe('mockWeatherData', () => {
  it('fornece cidade, fuso e todos os campos atuais para desenvolver a UI', () => {
    expect(mockWeatherData.city).toEqual({
      id: 3448439,
      name: 'S\u00e3o Paulo',
      country: 'Brasil',
      admin1: 'S\u00e3o Paulo',
      latitude: -23.5475,
      longitude: -46.63611,
    });
    expect(mockWeatherData.timezone).toBe('America/Sao_Paulo');
    expect(mockWeatherData.current).toEqual({
      temperatureC: 22.4,
      weatherCode: 2,
      referenceTime: '2026-10-07T14:00',
      apparentTemperatureC: 23.1,
      relativeHumidity: 61,
      windSpeedKmh: 12.6,
      precipitationMm: 0,
    });
  });

  it('fornece cinco dias completos e consecutivos a partir da data de referencia', () => {
    expect(mockWeatherData.forecast.map((day) => day.date)).toEqual([
      '2026-10-07',
      '2026-10-08',
      '2026-10-09',
      '2026-10-10',
      '2026-10-11',
    ]);
    expect(mockWeatherData.forecast[0].date).toBe(
      mockWeatherData.current.referenceTime?.slice(0, 10),
    );

    for (const day of mockWeatherData.forecast) {
      expect(day.weatherCode).toEqual(expect.any(Number));
      expect(day.minimumC).toEqual(expect.any(Number));
      expect(day.maximumC).toEqual(expect.any(Number));
      expect(day.minimumC).toBeLessThanOrEqual(day.maximumC as number);
      expect(day.precipitationProbability).toBeGreaterThanOrEqual(0);
      expect(day.precipitationProbability).toBeLessThanOrEqual(100);
    }
  });
});
