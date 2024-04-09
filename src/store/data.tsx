import moment from 'moment'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import testData from './json/test.json'

export type DataStoreType = {
  data: OilType | null;

  FactItems:  {
    [id: number]: Array<Array<{
      date: string,
      'Местор.': string,
      'N,N скважин': string, 
      'Эффект': number
    }>> 
  } | null;

  PlanItems:  {
    [id: number]: Array<Array<{
      date: string,
      'Местор.': string,
      'N,N скважин': string, 
      'Эффект': number
    }>> ,
  } | null;

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

// function newGroupByDate(arr) {
//   const temp = arr.reduce((acc, item) => {
//     const date = item.date
//     if (acc[date]) {
//       acc[date].push(item)
//     } else {
//       acc[Number(date)] = [item]
//     }
//     return acc
//   }, {})
//   return temp
// }

const useDataStore = create<DataStoreType>()(devtools((set, get) => ({
  data: null,
  FactItems: null,
  PlanItems: null,
  SumItems: null,
  DailySumPlan: groupByDate(testData.Partitions[0].PlanItems),
  DailySumFact: groupByDate(testData.Partitions[0].FactItems),

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

    console.log(data)
    if(!temp) temp = {} 
    if(!temp[data.colId]) temp[data.colId + ''] = {}

    if( temp[data.colId][data.day]) {
      if(temp[data.colId][data.day][data.colIndex]) {
        temp[data.colId][data.day][data.colIndex]['Местор.'] = data.newPlaceName
        temp[data.colId][data.day][data.colIndex]['N,N скважин'] = data.newPlaceNum
        temp[data.colId][data.day][data.colIndex]['Эффект'] = data.newWeight
      } else {
        temp[data.colId][data.day].push({
          date: data.day,
          'Местор.': data.newPlaceName,
          'N,N скважин': data.newWeight,
          'Эффект': data.newPlaceNum
        })
      }
    } else {
      temp[data.colId][data.day] = [{
        date: data.day,
        'Местор.': data.newPlaceName,
        'N,N скважин': data.newWeight,
        'Эффект': data.newPlaceNum
      }]
    }

    return (data.colType === 'plan' ? { PlanItems: temp } : { FactItems: temp })
  }),

  // addFactItems: (data) => set(() => {
  //   return { FactItems: [...get().FactItems, newGroupByDate(data)]}
  // }),
}), {enabled: true, name: 'DataStore'}))

export default useDataStore