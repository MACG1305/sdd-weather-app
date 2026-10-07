import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  type LucideIcon,
  Snowflake,
  Sun,
  Thermometer,
} from 'lucide-react';

interface WeatherCondition {
  label: string;
  Icon: LucideIcon;
}

const conditions = new Map<number, WeatherCondition>([
  [0, { label: 'C\u00e9u limpo', Icon: Sun }],
  [1, { label: 'Predominantemente limpo', Icon: CloudSun }],
  [2, { label: 'Parcialmente nublado', Icon: CloudSun }],
  [3, { label: 'Nublado', Icon: Cloud }],
  [45, { label: 'Nevoeiro', Icon: CloudFog }],
  [48, { label: 'Nevoeiro com geada', Icon: CloudFog }],
  [51, { label: 'Garoa leve', Icon: CloudDrizzle }],
  [53, { label: 'Garoa moderada', Icon: CloudDrizzle }],
  [55, { label: 'Garoa intensa', Icon: CloudDrizzle }],
  [56, { label: 'Garoa congelante leve', Icon: CloudDrizzle }],
  [57, { label: 'Garoa congelante intensa', Icon: CloudDrizzle }],
  [61, { label: 'Chuva leve', Icon: CloudRain }],
  [63, { label: 'Chuva moderada', Icon: CloudRain }],
  [65, { label: 'Chuva intensa', Icon: CloudRain }],
  [66, { label: 'Chuva congelante leve', Icon: CloudRain }],
  [67, { label: 'Chuva congelante intensa', Icon: CloudRain }],
  [71, { label: 'Neve leve', Icon: CloudSnow }],
  [73, { label: 'Neve moderada', Icon: CloudSnow }],
  [75, { label: 'Neve intensa', Icon: CloudSnow }],
  [77, { label: 'Gr\u00e3os de neve', Icon: Snowflake }],
  [80, { label: 'Pancadas de chuva leves', Icon: CloudRain }],
  [81, { label: 'Pancadas de chuva moderadas', Icon: CloudRain }],
  [82, { label: 'Pancadas de chuva intensas', Icon: CloudRain }],
  [85, { label: 'Pancadas de neve leves', Icon: CloudSnow }],
  [86, { label: 'Pancadas de neve intensas', Icon: CloudSnow }],
  [95, { label: 'Trovoada', Icon: CloudLightning }],
  [96, { label: 'Trovoada com granizo leve', Icon: CloudLightning }],
  [99, { label: 'Trovoada com granizo intenso', Icon: CloudLightning }],
]);

const unavailable: WeatherCondition = {
  label: 'Condi\u00e7\u00e3o indispon\u00edvel',
  Icon: Thermometer,
};

export function getWeatherCondition(code: number | undefined): WeatherCondition {
  return code === undefined ? unavailable : (conditions.get(code) ?? unavailable);
}
