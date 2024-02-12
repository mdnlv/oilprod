import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type StoreType = {
  bears: number;
  increasePopulation: () => void;
  removeAllBears: () => void;
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
  Id: 2,
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
  bears: 1,
  increasePopulation: () => set({ bears: get().bears + 1 }, false, 'inc'),
  removeAllBears: () => set({ bears: 0 }),
}), {enabled: true, name: 'MyStore'}))

export default useStore