import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const names = [
  {
    'id': 1,
    'name': 'ВНС(т/сут)'
  },
  {
    'id': 2,
    'name': 'ЗБС(т/сут)'
  },
  {
    'id': 3,
    'name': 'Возврат(т/сут)'
  },
  {
    'id': 14,
    'name': 'Итого по основным ГТМ(т/сут)',
    'total': true
  },
  {
    'id': 15,
    'name': 'Накопленная по основным ГТМ(т/сут)',
    'total': true
  },
  {
    'id': 16,
    'name': 'Оптимизация(т/сут)'
  },
  {
    'id': 4,
    'name': 'С переходящим фондом'
  },
  {
    'id': 17,
    'name': 'Ввод из БД (без инвест)(т/сут)'
  },
  {
    'id': 18,
    'name': 'Прирост от мероприятий на БФ(т/сут)'
  },
  {
    'id': 20,
    'name': 'Сокращение потенциала простоя(т/сут)'
  },
  {
    'id': 21,
    'name': 'Изменение базовой добычи(т/сут)',
    'total': true
  },
  {
    'id': 22,
    'name': 'Накопленный эффект по базовому дебиту(т/сут)',
    'total': true
  },
  {
    'id': 23,
    'name': 'Прочая добыча(т)',
    'total': true
  },
  {
    'id': 24,
    'name': 'Итого увеличение добычи(т)',
    'total': true
  },
  {
    'id': 25,
    'name': 'Рост потенциала простоя(т/сут)'
  },
  {
    'id': 26,
    'name': 'Остановки по роспоряжению(т/сут)'
  },
  {
    'id': 27,
    'name': 'Остановки нерентабельного фонда(т/сут)'
  },
  {
    'id': 27,
    'name': 'Пеевод скважин в ППД(т/сут)'
  },
  {
    'id': 29,
    'name': 'Итого остановок(т/сут)',
    'total': true
  },
  {
    'id': 30,
    'name': 'Накопленная по остановкам(т/сут)',
    'total': true
  },
  {
    'id': 31,
    'name': 'Остановоный дебит ЗБС, Возвраты, Углубления(т/сут)'
  },
  {
    'id': 33,
    'name': 'Исследования(т)',
    'total': true
  },
  {
    'id': 31,
    'name': 'ОТМ УЭС(т)',
    'total': true
  },
  {
    'id': 32,
    'name': 'ОТМ УЭТ(т)',
    'total': true
  },
  {
    'id': 41,
    'name': 'ОТМ УДНГ(т)',
    'total': true
  },

  {
    'id': 34,
    'name': 'Итого по ОТМ(т)',
    'total': true
  },
  {
    'id': 47,
    'name': 'Прочие потери(т)',
    'total': true
  },
  {
    'id': 36,
    'name': 'Геологическое снижение(т/сут)',
    'total': true
  },
  {
    'id': 42,
    'name': 'Сверхнормативное снижение(т/сут)',
    'total': true
  },
  {
    'id': 37,
    'name': 'Итого потерь(т)',
    'total': true
  },
  {
    'id': 38,
    'name': 'Итого добыча(т)',
    'total': true
  },
  {
    'id': 44,
    'name': 'КЦ',
    'total': true
  },
  {
    'id': 46,
    'name': 'МЭ',
    'total': true
  },
  {
    'id': 40,
    'name': 'Потенциал простоя(т/сут)',
    'total': true
  }
]


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
}), {enabled: true, name: 'MyStore'}))

export default useStore