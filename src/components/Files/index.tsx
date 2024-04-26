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
  0: ['ГРП']
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

// Корректировка
// function getCorrect(object) {
//   console.log(object['!ref'].split(':')[1].match(/[0-9/.]+/)[0])
//   const strNum = Number(object['!ref'].split(':')[1].match(/[0-9/.]+/)[0])
//   const temp = {}
  
//   for (let i = 10; i < strNum; i++) {
//     if(object['AS'+i] && object['AS'+i].v !== '') {
//       console.log(object['AS'+i])
//       // temp[object['P'+i].w.substr(0, 2)] 
//       //   ? temp[object['P'+i].w.substr(0, 2)][0]['Эффект'] += object['AG'+i].v
//       //   :  temp[object['P'+i].w.substr(0, 2)] = [{'Эффект': object['AG'+i].v}]
//     }
//   }
//   return temp
// } 

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
          1: getKeyByValue(wb.Sheets['Запуски скважин АО ГПН-ННГ'], events[1]), // ВНС
          2: getKeyByValue(wb.Sheets['Запуски скважин АО ГПН-ННГ'], events[2]), // ЗБС
          5: [...keys5_1, ...keys5_2],                                         // ГРП
          3: getKeyByValue(wb.Sheets['Запуски скважин АО ГПН-ННГ'], events[3]), // Возврат
          25: getAllKey(wb.Sheets['Остановки скважин АО ГПН-ННГ']),             // Рост потенциала простоя
          47: wb.Sheets['ВСП ЦИТС'],                                            // Прочие потери
          //'correct': wb.Sheets['Запуски-Остановки ДДНГ-МЭР'],                    // Корректировки ГРП
          20: getKeyByValue(wb.Sheets['Запуски скважин АО ГПН-ННГ'], ['ИЗ ПРОСТ']),   // Сокращение ПП
          17: getKeyByValue(wb.Sheets['Запуски скважин АО ГПН-ННГ'], ['ИЗ Б/ПР.ЛЕТ', 'ИЗ ОСВОЕНИЯ ТЕК.ГОДА', 'ИЗ ПЪЕЗОМЕТРА', 'ИЗ ТЕК.БЕЗД']) // Вывод из БД
        }

        //const tCorrect = getCorrect(keys['correct'])
        const gtmKeys = [...keys[2], ...keys[5], ...keys[3]].map(i => i.slice(1))
        const t = {2:[], 5:[], 3:[], 17:[], 20:[]}
        console.log(keys[2])
        console.log(keys[5])
        console.log(keys[3])

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const vichet = (x: number) => {
          for(const el of keys[x]) {
            if((gtmKeys.indexOf(el.slice(2)) > -1)) {

              const wGrp = wb.Sheets['Запуски скважин АО ГПН-ННГ']['U'+el.slice(2)].w - wb.Sheets['Запуски скважин АО ГПН-ННГ']['M'+el.slice(2)].w
              if(wGrp > 0) {
                console.log(wGrp)
                if((keys[2].map(i => i.slice(1)).indexOf(el.slice(2)) > -1)) {
                  console.log(el)
                  t[2].push({
                    date: wb.Sheets['Запуски скважин АО ГПН-ННГ']['F'+el.slice(2)].w.substr(0, 2),
                    'Местор.': wb.Sheets['Запуски скважин АО ГПН-ННГ']['G'+el.slice(2)].w,
                    'N,N скважин': wb.Sheets['Запуски скважин АО ГПН-ННГ']['H'+el.slice(2)].w.replace('^',''), 
                    'Эффект': wGrp
                  })
                } else if((keys[5].map(i => i.slice(1)).indexOf(el.slice(2)) > -1)) {
                  console.log(el)
                  t[5].push({
                    date: wb.Sheets['Запуски скважин АО ГПН-ННГ']['F'+el.slice(2)].w.substr(0, 2),
                    'Местор.': wb.Sheets['Запуски скважин АО ГПН-ННГ']['G'+el.slice(2)].w,
                    'N,N скважин': wb.Sheets['Запуски скважин АО ГПН-ННГ']['H'+el.slice(2)].w.replace('^',''), 
                    'Эффект': wGrp
                  })
                } else if ((keys[3].map(i => i.slice(1)).indexOf(el.slice(2)) > -1)) {
                  console.log(el)
                  t[3].push({
                    date: wb.Sheets['Запуски скважин АО ГПН-ННГ']['F'+el.slice(2)].w.substr(0, 2),
                    'Местор.': wb.Sheets['Запуски скважин АО ГПН-ННГ']['G'+el.slice(2)].w,
                    'N,N скважин': wb.Sheets['Запуски скважин АО ГПН-ННГ']['H'+el.slice(2)].w.replace('^',''), 
                    'Эффект': wGrp
                  })
                }
              }
              t[x].push({
                date: wb.Sheets['Запуски скважин АО ГПН-ННГ']['F'+el.slice(2)].w.substr(0, 2),
                'Местор.': wb.Sheets['Запуски скважин АО ГПН-ННГ']['G'+el.slice(2)].w,
                'N,N скважин': wb.Sheets['Запуски скважин АО ГПН-ННГ']['H'+el.slice(2)].w.replace('^',''), 
                'Эффект': wb.Sheets['Запуски скважин АО ГПН-ННГ']['M'+el.slice(2)].w
              })
            } else {
              t[x].push({
                date: wb.Sheets['Запуски скважин АО ГПН-ННГ']['F'+el.slice(2)].w.substr(0, 2),
                'Местор.': wb.Sheets['Запуски скважин АО ГПН-ННГ']['G'+el.slice(2)].w,
                'N,N скважин': wb.Sheets['Запуски скважин АО ГПН-ННГ']['H'+el.slice(2)].w.replace('^',''), 
                'Эффект': wb.Sheets['Запуски скважин АО ГПН-ННГ']['U'+el.slice(2)].w
              })
            }
          }
        }
        
        vichet(20)
        vichet(17)

        fact[17] = newGroupByDate(t[17])
        fact[20] = newGroupByDate(t[20])
        fact[2] = newGroupByDate(t[2])
        fact[5] = newGroupByDate(t[5])
        fact[3] = newGroupByDate(t[3])

        fact[1] = newGroupByDate(keys[1].map(item => ({
          date: wb.Sheets['Запуски скважин АО ГПН-ННГ']['F'+item.slice(1)].w.substr(0, 2),
          'Местор.': wb.Sheets['Запуски скважин АО ГПН-ННГ']['G'+item.slice(1)].w,
          'N,N скважин': wb.Sheets['Запуски скважин АО ГПН-ННГ']['H'+item.slice(1)].w.replace('^',''), 
          'Эффект': wb.Sheets['Запуски скважин АО ГПН-ННГ']['U'+item.slice(1)].w
        })))

        fact[25] = newGroupByDate(keys[25].map(item => ({
          date: wb.Sheets['Остановки скважин АО ГПН-ННГ']['G'+item.slice(1)].w.substr(0, 2),
          'Местор.': wb.Sheets['Остановки скважин АО ГПН-ННГ']['H'+item.slice(1)].w,
          'N,N скважин': wb.Sheets['Остановки скважин АО ГПН-ННГ']['I'+item.slice(1)].w.replace('^',''), 
          'Эффект': wb.Sheets['Остановки скважин АО ГПН-ННГ']['M'+item.slice(1)].w
        })))

        fact[44] = {}
        fact[46] = {}
        for(let i = 1;  i <= days; i++) {
          fact[44][String(i).length === 1 ? '0' + String(i) : String(i)] = [{'Эффект': wb.Sheets['Сводка по изм. нал-ия нефти З+В']['C'+ (i+7)].v}]
          fact[46][String(i).length === 1 ? '0' + String(i) : String(i)] = [{'Эффект': wb.Sheets['Сводка по изм. нал-ия нефти З+В']['D'+ (i+7)].v}]
        }
        fact[47] = getPP(keys[47])

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