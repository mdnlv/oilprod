import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type Ngpd = {
  label: string;
  id: 'yes' | 'no' | 'all'
};

export type StoreType = {
  month: Date;
  setMonth: (Date) => void;

  ngpd: Ngpd;
  setNgpd: (Ngpd) => void;

  chart: boolean;
  changeChart: () => void;

  filter: boolean;
  changeFilter: () => void;
}

export type Items = {
  PlanId: number,
  ForecastId: number,
  FactStopId: number,
  FactStartId: number,
  FactStartCrId: number,
  FactFundChangeId: number,
  Day: Date,
  ShortName: string,
  Name: string,
  OilRate: string,
  Status: string,
  IsForecast: boolean,
  IsAddressless: boolean
}

export type PartitionType = {
  Id: number,
  Name: string,
  OptId: number,
  Color: string,
  PlanItems: Array<Items>,
  FactItems: Array<Items>,
  DailySum: Array<Array<number>>,
  PartitionSum: Array<Array<number>>,
}

export type OilType = {
  InputOilRatePlan: number,
  InputOilRateFact: number,
  InputIdleFundOldPlan: number
  InputIdleFundOldFact: number,
  Partitions: Array<PartitionType>,
  Month: Date,
  CompanyId: number,
  CompanyName: string
}

const useStore = create<StoreType>()(devtools((set, get) => ({
  month: new Date(),
  setMonth: (newMonth) => set(() => ({ month: newMonth })),

  ngpd: {
    label: 'Без НГПД',
    id: 'no',
  },
  setNgpd: (newNgpd) => set(() => ({ ngpd: newNgpd })),

  chart: false,
  changeChart: () => set({chart: !get().chart}),

  filter: false,
  changeFilter: () => set({filter: !get().filter}),
}), {enabled: true, name: 'MyStore'}))

export default useStore