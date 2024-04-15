import moment from 'moment'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import testData from './json/test.json'

type Cell = {
  date: string,
  'Местор.': string,
  'N,N скважин': string, 
  'Эффект': number
}

export type DataStoreType = {
  data: OilType | null;

  FactItems:  {
    [id: number]: Array<Array<Cell>> 
  } | null;

  PlanItems:  {
    [id: number]: Array<Array<Cell>>
  } | null;

  clipboard: Cell;
  setClipboard: (any) => void;

  sumItems: object | null;
  setSumItems: (any) => void;

  DailySumPlan: object;
  DailySumFact: object;
  setDailySum: (any) => void;
  setFactItems: (any) => void;
  setPlanItems: (any) => void;
  cellUpdate: (any) => void;
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
  InputIdleFundOldPlan: number,
  InputIdleFundOldFact: number,
  Partitions: Array<PartitionType>,
  Month: Date,
  CompanyId: number,
  CompanyName: string
}

function groupByDate(arr) {
  const temp = arr.reduce((acc, item) => {
    const date = moment(item.Day).format('D')
    if (acc[date]) {
      acc[date].push(item)
    } else {
      acc[date] = [item]
    }
    return acc
  }, {})
  return temp
}

const useDataStore = create<DataStoreType>()(devtools((set, get) => ({
  data: null,
  FactItems: null,
  PlanItems: null,
  sumItems: null,
  DailySumPlan: groupByDate(testData.Partitions[0].PlanItems),
  DailySumFact: groupByDate(testData.Partitions[0].FactItems),

  clipboard: null,

  setClipboard: (data) => set(() => {
    const temp = data.colType === 'plan' ? get().PlanItems : get().FactItems
    const day  = data.colType === 'plan' && String(data.day).length === 1 ? '0' + String(data.day) : String(data.day)
    return { clipboard: {
      date: day,
      'Местор.': temp[data.colId][day][data.colIndex]['Местор.'],
      'N,N скважин': temp[data.colId][day][data.colIndex]['N,N скважин'], 
      'Эффект': temp[data.colId][day][data.colIndex]['Эффект']
    } }
  }),

  setDailySum: (data) => set(() => {
    return { DailySumPlan: groupByDate(data.PlanItems),  DailySumFact: groupByDate(data.FactItems) }
  }),

  setFactItems: (data) => set(() => {
    return { FactItems: data }
  }),

  setPlanItems: (data) => set(() => {
    return { PlanItems: data }
  }),

  cellUpdate: (data) => set(() => {
    let temp = data.colType === 'plan' ? get().PlanItems : get().FactItems
    const day  = data.colType === 'plan' && String(data.day).length === 1 ? '0' + String(data.day) : String(data.day)
    if(data.newPlaceName == null) {
      temp[data.colId][day] = temp[data.colId][day].filter((_, index) => index !== data.colIndex)
      if(temp[data.colId][day].length === 0) delete temp[data.colId][day]
    } else {   
      if(!temp) temp = {} 
      if(!temp[data.colId]) temp[data.colId + ''] = {}
      
      if( temp[data.colId][day]) {
        if(temp[data.colId][day][data.colIndex]) {
          temp[data.colId][day][data.colIndex]['Местор.'] = data.newPlaceName
          temp[data.colId][day][data.colIndex]['N,N скважин'] = data.newPlaceNum
          temp[data.colId][day][data.colIndex]['Эффект'] = data.newWeight
        } else {
          temp[data.colId][day].push({
            date: day,
            'Местор.': data.newPlaceName,
            'N,N скважин': data.newPlaceNum,
            'Эффект': data.newWeight
          })
        }
      } else {
        temp[data.colId][day] = [{
          date: day,
          'Местор.': data.newPlaceName,
          'N,N скважин': data.newPlaceNum,
          'Эффект': data.newWeight
        }]
      }
    }

    return (data.colType === 'plan' ? { PlanItems: temp } : { FactItems: temp })
  }),

  setSumItems: (data) => set(() => {
    return { sumItems: data}
  }),

}), {enabled: true, name: 'DataStore'}))

export default useDataStore