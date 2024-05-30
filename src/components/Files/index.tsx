import React, { useRef, useState }  from 'react'
import { FileField } from '@consta/uikit/FileField'
import { read } from 'xlsx'
import useDataStore, { DataStoreType } from '../../store/data'
import { Attachment } from '@consta/uikit/Attachment'
import parsingXLSX from './script'
import moment from 'moment'
import useStore, { StoreType } from '../../store'

const obj = {
  'Ввод новых скважин': 1,
  'Зарезка бокового ствола': 2,
  'ГРП': 5,
  'Возврат': 3,
  'Оптимизация': 16,
  'Работа с переходящим фондом': 4,
  'Ввод из БД ТГ (без инвест.)': 17,
  'Базовый дебит ГТМ и Оптимизация скважин': 20,
  'Текущий простой': 20,
  'Рост потенциала простоя (в т.ч.остановки скв. для ГТМ, оптимизацию, нерентабельный фонд, по распоряжению)': 25,
  'Перевод скважин в ППД': 28,
  'Итого (с ВНР)': 23,
  'Геол. снижение,  т/сут': 36,
  'Итого (с ВСП)': 47,
  'Потенциал по графику': 40,
  // 'Нараст.  по потенциалу': 22,
  'Исследования, т/сут': 33,
  'Откл. Эл.Эн., т/сут': 31,
  'УЭТ, т/сут': 32,
  'УДНГ, т/сут': 41,
  'Приросты от мероприятий на базовом фонде': 18,
  'Ост. дебит от ЗБС, Углуб., ПВЛГ/ПНЛГ': 35,
  'Остановка скв нерентабельный фонд, по распоряжению': 26
  
  // Прочая добыча (Итого с ВСП) ->> Итого добыча 
  // Прочие потери (Итого с ВСП) ->> Итого потерь
}

const events = {
  2: ['Зарезка'],
  5: ['Гидроразрыв'],
  3: ['Возврат', 'Перевод на', 'Приобщение пласта'],
  1: ['Ввод новых'],
  0: ['ГРП'],
  16: ['Оптимизация'],
}

const prims = {
  17: ['ИЗ Б/ПР.ЛЕТ', 'ИЗ ОСВОЕНИЯ ТЕК.ГОДА', 'ИЗ ПЪЕЗОМЕТРА', 'ИЗ ТЕК.БЕЗД', 'ИЗ КОНСЕРВАЦИИ'],
  18: ['ИЗ ПРОСТ'],
}

const nameColList = Object.keys(obj)

// Для запусков
function getKeyByValue(object, value) {
  return Object.keys(object).filter(key => {
    for(const i of value) {
      if ((object[key].v + '').indexOf(i) > -1) {
        return true
      }
    }
    return false
  })
}

function getKeyByValueStrong(object, value) {
  return Object.keys(object).filter(key => {
    for(const i of value) {
      if ((object[key].v + '') === i) {
        return true
      }
    }
    return false
  })
}

// Для остановок
function getAllKey(object) {
  return Object.keys(object).filter(key => {
    return (key[0] === 'H' && key !== 'H8' && key !== 'H9') ? true : false
  })
} 

// Прочие потери 
function getPP(object) {
  const strNum = Number(object['!ref'].split(':')[1].match(/[0-9/.]+/)[0])
  const temp = {}
  for (let i = 10; i < strNum; i++) {
    if(object['P'+i]) {
      temp[object['P'+i].w.substr(0, 2)] 
        ? temp[object['P'+i].w.substr(0, 2)][0]['Эффект'] += object['AG'+i].v
        :  temp[object['P'+i].w.substr(0, 2)] = [{'Эффект': object['AG'+i].v}]
    }
  }
  return temp
} 

// Перевод в ППД

function getPPD(object) {
  const strNum = Number(object['!ref'].split(':')[1].match(/[0-9/.]+/)[0])
  const temp = {}
  for (let i = 17; i < strNum+1; i++) {
    if(object['U'+i]) {
      temp[moment(object['P'+i].w).format('D')] 
        ? temp[moment(object['P'+i].w).format('D')].push({
          'Местор.': object['L'+i].v,
          'N,N скважин': object['O'+i].v, 
          'Эффект': object['U'+i].v
        })
        : temp[moment(object['P'+i].w).format('D')] = [{
          'Местор.': object['L'+i].v,
          'N,N скважин': object['O'+i].v, 
          'Эффект': object['U'+i].v
        }]
    }
  }
  return temp
} 


// Корректировка
function getCorrect(object) {
  const strNum = Number(object['!ref'].split(':')[1].match(/[0-9/.]+/)[0])
  const temp = []
  const j = []

  const findJ = (x: number, k: number) => {      
    if(object['AE'+x].v !== '') j.push({index: x, q: k})
    else {
      x--
      findJ(x, k)
    }
  }

  for (let i = 10; i < strNum-10; i++)
    if(object['AS'+i] && object['AZ'+i].v !== '' && object['AZ'+i].v !== 0) findJ(i, object['AZ'+i].v)

  j.map(item => {
    const colId = () => {
      let temp = null
      for(const elI of Object.keys(events)) {
        for(const elJ of events[elI]) {
          if((object['AP'+item.index].v.indexOf(elJ) > -1 && elI !== '0') || (object['AP'+item.index].v === elJ && elI === '0')) 
            temp = elI
        }
      }      
      if(!temp)
        if(prims[17].indexOf(object['AR'+item.index].v) > -1) return 17 
        else if (prims[18].indexOf(object['AR'+item.index].v) > -1) return 18 
      return temp
    } 

    temp.push({
      dayCorrect: moment(object['AS'+item.index].v, 'DD.MM.YYYY').format('D'), 
      qCorrect: item.q, 
      qStart: object['AH'+item.index].v, 
      dayStart: moment(object['AE'+item.index].v, 'DD.MM.YYYY').format('D'), 
      placeNum: object['Z'+item.index].v,
      placeName: object['Y'+item.index].v,
      colId: Number(colId())
    })
  })
  return temp
}

function newGroupByDate(arr) {
  const temp = arr.reduce((acc, item) => {
    const date = item.date
    if (acc[date]) {
      acc[date].push(item)
    } else {
      acc[date] = [item]
    }
    return acc
  }, {})
  return temp
}

function adding(obj1, obj2) {
  const obj = Object.assign({}, obj1)
  for (const key in obj2) {
    obj2[key].map(item => {
      obj[Number(String(key).length == 1 ? String(key) + '0' : String(key))] ?
        obj[Number(String(key).length == 1 ? String(key) + '0' : String(key))].push(item)
        : obj[Number(String(key).length == 1 ? String(key) + '0' : String(key))] = [item]
    })
  }
  return obj
}

function addingCorrect(original, obj2) {
  obj2.map(item => {
    const dayStart = String(item.dayStart).length === 1 ? '0' + String(item.dayStart) : String(item.dayStart)
    const dayCorrect = String(item.dayCorrect).length === 1 ? '0' + String(item.dayCorrect) : String(item.dayCorrect)

    if(original && original[item.colId] && original[item.colId][dayCorrect]) {
      original[item.colId][dayCorrect].push({
        date: dayCorrect,
        'Местор.': 'cor' +item.placeName,
        'N,N скважин': item.placeNum,
        'Эффект': item.qCorrect
      })
    } else {
      original[item.colId][dayCorrect] = [{
        date: dayCorrect,
        'Местор.': 'cor' + item.placeName,
        'N,N скважин': item.placeNum,
        'Эффект': item.qCorrect
      }]
    }

    original[item.colId] && original[item.colId][dayStart] && original[item.colId][dayStart].map((el, i) => {
      if(el['N,N скважин'] === item.placeNum) original[item.colId][dayStart][i]['Эффект'] = item.qStart
    })

  })
}


const Files: React.FC = () => {
  const setFactItems = useDataStore((state : DataStoreType) => state.setFactItems)
  const setPlanItems = useDataStore((state : DataStoreType) => state.setPlanItems)
  const [starts, setStarts] = useState('')
  const [rgd, setRgd] = useState('')
  const fileFact = useRef(null)
  const filePlan = useRef(null)
  const days = moment(useStore((state : StoreType) => state.month)).daysInMonth()

  // Факт
  const importUsoi = () => {
    (async() =>{   
      const reader = new FileReader()
      const fileF = fileFact.current.files[0]
      reader.onerror = (event) => {
        console.log('File could not be read! Code ' + event.target.error.code)
      }
      reader.readAsBinaryString(fileF)
      reader.onload = (event) => {
        const dataFile = event.target.result
        const wb = read(dataFile, { type: 'binary' })
        const fact = {}

        const keys5_1 = getKeyByValue(wb.Sheets['Запуски скважин АО ГПН-ННГ'], events[5]) 
        const keys5_2 = getKeyByValueStrong(wb.Sheets['Запуски скважин АО ГПН-ННГ'], events[0])     
        const keys = {
          1: getKeyByValue(wb.Sheets['Запуски скважин АО ГПН-ННГ'], events[1]),// ВНС
          2: getKeyByValue(wb.Sheets['Запуски скважин АО ГПН-ННГ'], events[2]),// ЗБС
          5: [...keys5_1, ...keys5_2],                                         // ГРП
          3: getKeyByValue(wb.Sheets['Запуски скважин АО ГПН-ННГ'], events[3]), // Возврат
          25: getAllKey(wb.Sheets['Остановки скважин АО ГПН-ННГ']),             // Рост потенциала простоя
          28: wb.Sheets['Выход из простоя'],                                    // Перевод в ППД
          47: wb.Sheets['ВСП ЦИТС'],                                            // Прочие потери
          'correct': wb.Sheets['Запуски-Остановки ДДНГ-МЭР'],                   // Корректировки ГРП
          20: getKeyByValue(wb.Sheets['Запуски скважин АО ГПН-ННГ'], prims[18]),// Сокращение ПП
          17: getKeyByValue(wb.Sheets['Запуски скважин АО ГПН-ННГ'], prims[17]),// Вывод из БД
          16: getKeyByValue(wb.Sheets['Запуски скважин АО ГПН-ННГ'], events[16]), // Оптимизация
        }

        const gtmKeys = [...keys[2], ...keys[5], ...keys[3]].map(i => i.slice(1))
        const optKeys = keys[16].map(i => i.slice(1))
        const strtKeys = keys[1].map(i => i.slice(1))
        const forBf = [...gtmKeys, ...optKeys, ...strtKeys]
        const t = {2:[], 5:[], 3:[], 17:[], 20:[], 18:[], 16:[]}

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const vichet = (x: number) => {
          for(const el of keys[x]) {
            const wGrp = wb.Sheets['Запуски скважин АО ГПН-ННГ']['S'+el.slice(1)].w - wb.Sheets['Запуски скважин АО ГПН-ННГ']['M'+el.slice(1)].w
            if((forBf.indexOf(el.slice(1)) > -1)) {
              if(wGrp > 0) {
                if((keys[2].map(i => i.slice(1)).indexOf(el.slice(1)) > -1)) {
                  t[2].push({
                    date: wb.Sheets['Запуски скважин АО ГПН-ННГ']['F'+el.slice(1)].w.substr(0, 2),
                    'Местор.': wb.Sheets['Запуски скважин АО ГПН-ННГ']['G'+el.slice(1)].w,
                    'N,N скважин': wb.Sheets['Запуски скважин АО ГПН-ННГ']['H'+el.slice(1)].w.replace('^',''), 
                    'Эффект': wGrp
                  })
                } else if((keys[5].map(i => i.slice(1)).indexOf(el.slice(1)) > -1)) {
                  t[5].push({
                    date: wb.Sheets['Запуски скважин АО ГПН-ННГ']['F'+el.slice(1)].w.substr(0, 2),
                    'Местор.': wb.Sheets['Запуски скважин АО ГПН-ННГ']['G'+el.slice(1)].w,
                    'N,N скважин': wb.Sheets['Запуски скважин АО ГПН-ННГ']['H'+el.slice(1)].w.replace('^',''), 
                    'Эффект': wGrp
                  })
                } else if ((keys[3].map(i => i.slice(1)).indexOf(el.slice(1)) > -1)) {
                  t[3].push({
                    date: wb.Sheets['Запуски скважин АО ГПН-ННГ']['F'+el.slice(1)].w.substr(0, 2),
                    'Местор.': wb.Sheets['Запуски скважин АО ГПН-ННГ']['G'+el.slice(1)].w,
                    'N,N скважин': wb.Sheets['Запуски скважин АО ГПН-ННГ']['H'+el.slice(1)].w.replace('^',''), 
                    'Эффект': wGrp
                  })
                } else if ((keys[16].map(i => i.slice(1)).indexOf(el.slice(1)) > -1)) {
                  t[16].push({
                    date: wb.Sheets['Запуски скважин АО ГПН-ННГ']['F'+el.slice(1)].w.substr(0, 2),
                    'Местор.': wb.Sheets['Запуски скважин АО ГПН-ННГ']['G'+el.slice(1)].w,
                    'N,N скважин': wb.Sheets['Запуски скважин АО ГПН-ННГ']['H'+el.slice(1)].w.replace('^',''), 
                    'Эффект': wGrp
                  })
                }
              }
              wb.Sheets['Запуски скважин АО ГПН-ННГ']['M'+el.slice(1)].w && t[x].push({
                date: wb.Sheets['Запуски скважин АО ГПН-ННГ']['F'+el.slice(1)].w.substr(0, 2),
                'Местор.': 'dec' + wb.Sheets['Запуски скважин АО ГПН-ННГ']['G'+el.slice(1)].w,
                'N,N скважин': wb.Sheets['Запуски скважин АО ГПН-ННГ']['H'+el.slice(1)].w.replace('^',''), 
                'Эффект': wb.Sheets['Запуски скважин АО ГПН-ННГ']['M'+el.slice(1)].w
              })
            } else {
              if(x === 17) {
                t[x].push({
                  date: wb.Sheets['Запуски скважин АО ГПН-ННГ']['F'+el.slice(1)].w.substr(0, 2),
                  'Местор.': wb.Sheets['Запуски скважин АО ГПН-ННГ']['G'+el.slice(1)].w,
                  'N,N скважин': wb.Sheets['Запуски скважин АО ГПН-ННГ']['H'+el.slice(1)].w.replace('^',''), 
                  'Эффект': wb.Sheets['Запуски скважин АО ГПН-ННГ']['S'+el.slice(1)].w
                })     
              } else {
                Math.round(Number(wGrp)) !== 0 && 
                t[18].push({
                  date: wb.Sheets['Запуски скважин АО ГПН-ННГ']['F'+el.slice(1)].w.substr(0, 2),
                  'Местор.': wb.Sheets['Запуски скважин АО ГПН-ННГ']['G'+el.slice(1)].w,
                  'N,N скважин': wb.Sheets['Запуски скважин АО ГПН-ННГ']['H'+el.slice(1)].w.replace('^',''), 
                  'Эффект': wGrp
                })        
                t[x].push({
                  date: wb.Sheets['Запуски скважин АО ГПН-ННГ']['F'+el.slice(1)].w.substr(0, 2),
                  'Местор.': wb.Sheets['Запуски скважин АО ГПН-ННГ']['G'+el.slice(1)].w,
                  'N,N скважин': wb.Sheets['Запуски скважин АО ГПН-ННГ']['H'+el.slice(1)].w.replace('^',''), 
                  'Эффект': wb.Sheets['Запуски скважин АО ГПН-ННГ']['M'+el.slice(1)].w
                })                
              }

            }
          }
        }
        
        vichet(20)
        vichet(17)

        fact[17] = newGroupByDate(t[17])
        fact[20] = adding(newGroupByDate(t[20]), getPPD(keys[28]))
        fact[2] = newGroupByDate(t[2])
        fact[5] = newGroupByDate(t[5])
        fact[3] = newGroupByDate(t[3])
        fact[18] = newGroupByDate(t[18])
        fact[16] = newGroupByDate(t[16])
        fact[1] = newGroupByDate(keys[1].map(item => ({
          date: wb.Sheets['Запуски скважин АО ГПН-ННГ']['F'+item.slice(1)].w.substr(0, 2),
          'Местор.': wb.Sheets['Запуски скважин АО ГПН-ННГ']['G'+item.slice(1)].w,
          'N,N скважин': wb.Sheets['Запуски скважин АО ГПН-ННГ']['H'+item.slice(1)].w.replace('^',''), 
          'Эффект': wb.Sheets['Запуски скважин АО ГПН-ННГ']['S'+item.slice(1)].w
        })))
        fact[25] = newGroupByDate(keys[25].map(item => 
          // wb.Sheets['Остановки скважин АО ГПН-ННГ']['M'+item.slice(1)].w && 
          ({
            date: wb.Sheets['Остановки скважин АО ГПН-ННГ']['G'+item.slice(1)].w.substr(0, 2),
            'Местор.': wb.Sheets['Остановки скважин АО ГПН-ННГ']['H'+item.slice(1)].w,
            'N,N скважин': wb.Sheets['Остановки скважин АО ГПН-ННГ']['I'+item.slice(1)].w.replace('^',''), 
            'Эффект': wb.Sheets['Остановки скважин АО ГПН-ННГ']['M'+item.slice(1)].w
          })))

        fact[28] = getPPD(keys[28])
        fact[44] = {}
        fact[46] = {}
        for(let i = 1;  i <= days; i++) {
          fact[44][String(i).length === 1 ? '0' + String(i) : String(i)] = [{'Эффект': wb.Sheets['Сводка по изм. нал-ия нефти З+В']['C'+ (i+7)].v}]
          fact[46][String(i).length === 1 ? '0' + String(i) : String(i)] = [{'Эффект': wb.Sheets['Сводка по изм. нал-ия нефти З+В']['D'+ (i+7)].v}]
        }
        fact[47] = getPP(keys[47])

        addingCorrect(fact, getCorrect(keys['correct']))
        setFactItems(fact)

        setStarts('xls')
      }
    })() 
  }

  // План
  const importRgd = () => {
    (async() => {
      const reader = new FileReader()
      const file = filePlan.current.files[0]

      reader.onerror = (event) => {
        console.log('File could not be read! Code ' + event.target.error.code)
      }
      reader.readAsBinaryString(file)
      reader.onload = (event) => {
        const dataFile = event.target.result
        const parsingData = parsingXLSX.parse(
          dataFile,
          nameColList
        )
        const tempo = {}
        for (const key in parsingData) {
          if(obj[key] !== 0) {
            if(!tempo[obj[key]]) { 
              tempo[obj[key]] = parsingData[key] 
            } else {
              for (const i in parsingData[key]) {  
                tempo[obj[key]][i] 
                  ? tempo[obj[key]][i] = [...tempo[obj[key]][i], ...parsingData[key][i]] 
                  : tempo[obj[key]][i] = parsingData[key][i]
              }
            } 
          }   
        }
        setPlanItems(tempo)
        setRgd('xls')
      }
    })() 
  }

  return (<div style={{
    display: 'flex', 
    flexDirection: 'row', 
    width: '100%', 
    justifyContent: 'space-between',
    alignItems: 'center',
  }}>
    <FileField  id="FileFieldWithText3" inputRef={filePlan} onChange={importRgd}>
      {(props) => <Attachment {...props} style={{ width: 122, marginRight: -20 }}
        withPictogram
        fileName="Загрузить РГД"
        fileExtension={rgd}
        size='xs'
      />}
    </FileField>
    <FileField id="FileFieldWithText1" inputRef={fileFact} onChange={importUsoi}>
      {(props) =>       
        <Attachment {...props} style={{ width: 122, marginRight: -8 }}
          withPictogram
          fileName="Загрузить УСОИ"
          fileExtension={starts}
          size='xs'
        />}
    </FileField>
  </div>)
}

export default Files