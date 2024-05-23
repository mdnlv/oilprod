import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type Ngpd = {
  label: string;
  id: 'yes' | 'no' | 'all'
};

type Tab = 'chart' | 'report' | 'table';

export type StoreType = {
  data: OilType | null;

  month: Date;
  setMonth: (Date) => void;

  ngpd: Ngpd;
  setNgpd: (Ngpd) => void;

  tab: Tab;
  changeTab: (Tab) => void;

  filter: boolean;
  changeFilter: () => void;

  apd: boolean;
  changeApd: () => void;


  openModal: boolean;
  changeOpenModal: () => void;
  saveModal: boolean;
  changeSaveModal: () => void;
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
  data: null,

  month: new Date('2024-01-12T23:50:21.817Z'),
  setMonth: (newMonth) => set(() => ({ month: newMonth })),

  ngpd: {
    label: 'Без НГДП',
    id: 'no',
  },
  setNgpd: (newNgpd) => set(() => ({ ngpd: newNgpd })),

  tab: 'table',
  changeTab: (newTab) => set({tab: newTab}),

  filter: false,
  changeFilter: () => set({filter: !get().filter}),

  apd: false,
  changeApd: () => set({apd: !get().apd}),

  openModal: false,
  changeOpenModal: () => set({openModal: !get().openModal}),
  saveModal: false,
  changeSaveModal: () => set({saveModal: !get().saveModal}),
}), {enabled: true, name: 'MyStore'}))

export default useStore