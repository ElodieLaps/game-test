import { StatisticName } from '@shared/types';

export type Statistic = {
  name: StatisticName;
  currentValue: number;
  value: number;
  progressIndex: number;
};

export type Statistics = Record<StatisticName, Omit<Statistic, 'name'>>;
