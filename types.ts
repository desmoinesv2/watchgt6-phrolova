export interface WatchState {
  isAOD: boolean;
  batteryLevel: number;
  heartRate: number;
  steps: number;
  date: Date;
  weatherTemp: number;
  weatherCondition: 'Sunny' | 'Cloudy' | 'Rainy';
  notificationCount: number;
}

export interface ScaleConfig {
  bezelScale: number;
  iconScale: number;
}

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgImage: string;
  quote: string;
  scales: ScaleConfig;
}

export enum WatchMode {
  ACTIVE = 'ACTIVE',
  AOD = 'AOD'
}