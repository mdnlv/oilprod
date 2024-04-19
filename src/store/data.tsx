import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

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

  // DailySumPlan: object;
  // DailySumFact: object;
  // setDailySum: (any) => void;

  setFactItems: (any) => void;
  setPlanItems: (any) => void;
  cellUpdate: (any) => void;

  column14: ()=> object;
  column21: ()=> object;
  column29: ()=> object;
  column34: ()=> object;
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

const useDataStore = create<DataStoreType>()(devtools((set, get) => ({
  data: null,
  FactItems: null,
  PlanItems: null,
  sumItems: null,
   
  column14: () => {
    const indexes = [1, 2, 5, 3]
    const obj = {};
    
    [...Array(31)].map((_,i) => {
      const day = i + 1
      const pday = String(day).length === 1 ? '0' + String(day) : String(day)
      const fact = {count: 0, weight: 0}
      const plan = {count: 0, weight: 0}

      indexes.map(index => {
        if (get().FactItems && get().FactItems[index] && get().FactItems[index][day]) {
          fact.weight = fact.weight + get().FactItems[index][day].reduce((p,c) => p+Math.round(Number(c['Эффект'])), 0)
          fact.count = fact.count + get().FactItems[index][day].length
        }

        if (get().PlanItems && get().PlanItems[index] && get().PlanItems[index][pday]) {
          plan.weight = plan.weight + get().PlanItems[index][pday].reduce((p,c) => p+Math.round(Number(c['Эффект'])), 0)
          plan.count = plan.count + get().PlanItems[index][pday].length
        }
      })

      if(fact.count > 0 || plan.count > 0 || fact.weight > 0|| plan.weight > 0 ) obj[day] = {
        fact: fact,
        plan: plan
      }
    })

    return obj
  },
  
  column21: () => {
    const indexes = [16, 4, 17, 18, 20]
    const obj = {};
    
    [...Array(31)].map((_,i) => {
      const day = i + 1
      const pday = String(day).length === 1 ? '0' + String(day) : String(day)
      const fact = {count: 0, weight: 0}
      const plan = {count: 0, weight: 0}

      indexes.map(index => {
        if (get().FactItems && get().FactItems[index] && get().FactItems[index][day]) {
          fact.weight = fact.weight + get().FactItems[index][day].reduce((p,c) => p+Number(c['Эффект']), 0)
          fact.count = fact.count + get().FactItems[index][day].length
        }

        if (get().PlanItems && get().PlanItems[index] && get().PlanItems[index][pday]) {
          plan.weight = plan.weight + get().PlanItems[index][pday].reduce((p,c) => p+Number(c['Эффект']), 0)
          plan.count = plan.count + get().PlanItems[index][pday].length
        }
      })

      if(fact.count > 0 || plan.count > 0 || fact.weight > 0|| plan.weight > 0 ) obj[day] = {
        fact: fact,
        plan: plan
      }
    })

    return obj
  },

  column29: () => {
    const indexes = [25, 26, 27, 28]
    const obj = {};
    
    [...Array(31)].map((_,i) => {
      const day = i + 1
      const pday = String(day).length === 1 ? '0' + String(day) : String(day)
      const fact = {count: 0, weight: 0}
      const plan = {count: 0, weight: 0}

      indexes.map(index => {
        if (get().FactItems && get().FactItems[index] && get().FactItems[index][day]) {
          fact.weight = fact.weight + get().FactItems[index][day].reduce((p,c) => p+Number(c['Эффект']), 0)
          fact.count = fact.count + get().FactItems[index][day].length
        }

        if (get().PlanItems && get().PlanItems[index] && get().PlanItems[index][pday]) {
          plan.weight = plan.weight + get().PlanItems[index][pday].reduce((p,c) => p+Number(c['Эффект']), 0)
          plan.count = plan.count + get().PlanItems[index][pday].length
        }
      })

      if(fact.count > 0 || plan.count > 0 || fact.weight > 0|| plan.weight > 0 ) obj[day] = {
        fact: fact,
        plan: plan
      }
    })

    return obj
  },

  column34: () => {
    const indexes = [33, 31, 32, 41]
    const obj = {};
    
    [...Array(31)].map((_,i) => {
      const day = i + 1
      const pday = String(day).length === 1 ? '0' + String(day) : String(day)
      let fact = 0
      let plan = 0

      indexes.map(index => {
        if (get().FactItems && get().FactItems[index] && get().FactItems[index][day]) {
          fact = fact + Number(get().FactItems[index][day][0]['Эффект'])
        }

        if (get().PlanItems && get().PlanItems[index] && get().PlanItems[index][pday]) {
          plan = plan + Number(get().PlanItems[index][pday][0]['Эффект'])
        }
      })

      if( fact  > 0 || plan  > 0 ) obj[day] = {
        fact: fact,
        plan: plan
      }
    })

    return obj
  },


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