import type { WeatherData } from '../types/weather';

export const mockWeatherData: WeatherData = {
  city: {
    id: 3448439,
    name: 'S\u00e3o Paulo',
    country: 'Brasil',
    admin1: 'S\u00e3o Paulo',
    latitude: -23.5475,
    longitude: -46.63611,
  },
  timezone: 'America/Sao_Paulo',
  current: {
    temperatureC: 22.4,
    weatherCode: 2,
    referenceTime: '2026-10-07T14:00',
    apparentTemperatureC: 23.1,
    relativeHumidity: 61,
    windSpeedKmh: 12.6,
    precipitationMm: 0,
  },
  forecast: [
    {
      date: '2026-10-07',
      weatherCode: 2,
      minimumC: 16.2,
      maximumC: 25.4,
      precipitationProbability: 10,
    },
    {
      date: '2026-10-08',
      weatherCode: 3,
      minimumC: 17,
      maximumC: 26.1,
      precipitationProbability: 20,
    },
    {
      date: '2026-10-09',
      weatherCode: 61,
      minimumC: 18.1,
      maximumC: 23.8,
      precipitationProbability: 60,
    },
    {
      date: '2026-10-10',
      weatherCode: 2,
      minimumC: 16.8,
      maximumC: 25,
      precipitationProbability: 15,
    },
    {
      date: '2026-10-11',
      weatherCode: 1,
      minimumC: 17.3,
      maximumC: 26.4,
      precipitationProbability: 5,
    },
  ],
};
