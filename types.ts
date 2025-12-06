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

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgImage: string;
  quote: string;
}

export enum WatchMode {
  ACTIVE = 'ACTIVE',
  AOD = 'AOD'
}