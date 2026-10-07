export type Unit = 'celsius' | 'fahrenheit';

export interface City {
  id: number;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  temperatureC?: number;
  weatherCode?: number;
  referenceTime?: string;
  apparentTemperatureC?: number;
  relativeHumidity?: number;
  windSpeedKmh?: number;
  precipitationMm?: number;
  pressureHpa?: number;
}

export interface ForecastDay {
  date: string;
  weatherCode?: number;
  minimumC?: number;
  maximumC?: number;
  precipitationProbability?: number;
}

export interface WeatherData {
  city: City;
  timezone: string;
  current: CurrentWeather;
  forecast: ForecastDay[];
}
