'use strict'
import { read, utils } from 'xlsx'
// — он берет столбец, например «Ввод новых скважин», определяет какие он колонки занимает (подколонки) минут последную,
// тк обычно в ней находиться вычесляемые значения. Нужно убедиться что у всех колонок такой вид

const parsingXLSX = {
  /**
   * принципы наименования
   * colIndex — 3
   * colName — D
   * rowIndex — 3
   * rowName — 4
   * address — { r:1, c:0 }
   * a1Address — A2
   * range — { s: { c: 0, r: 0 }, e: { c: 3, r: 2 } }
   * a1Range — A1:D3
   */

  worksheet: null,

  init(dataFile) {
    const workbook = read(dataFile, { type: 'binary' })
    this.worksheet = workbook.Sheets['Расчет_Суточной_Добычи_По_Датам']
  },

  parse(dataFile, nameColList) {
    this.init(dataFile)

    const indexSubColsOfCols = this.getIndexSubColsOfCols(nameColList)
    const subRowDayObj = this.getSubRowDayObj()

    return this.getResult(indexSubColsOfCols, subRowDayObj)
  },

  findAdressCellByName(name) {
    for (const cellAddress in this.worksheet) {
      // eslint-disable-next-line no-prototype-builtins
      if (!this.worksheet.hasOwnProperty(cellAddress)) continue

      const cell = this.worksheet[cellAddress]
      if (cell.v === name) {
        return utils.decode_cell(cellAddress)
      }
    }
    return null
  },

  getMergedRange(cell) {
    const merges = this.worksheet['!merges']

    if (!merges || merges.lenght === 0) {
      return null
    }

    for (const range of merges) {
      if (
        cell.r >= range.s.r &&
        cell.r <= range.e.r &&
        cell.c >= range.s.c &&
        cell.c <= range.e.c
      ) {
        return range
      }
    }

    return null
  },

  getColumsCell(valueCell) {
    const adress = this.findAdressCellByName(valueCell)

    if (!adress) {
      return []
    }

    const mergedRange = this.getMergedRange(adress)

    if (mergedRange) {
      const colums = new Array(mergedRange.e.c - mergedRange.s.c + 1)
        .fill(null)
        .map((_, i) => mergedRange.s.c + i)

      /**
       * если колонка имеет несколько подсталбцов, убираем послдений
       * столбец с вычесляемым значением
       */
      if (colums.length > 1) {
        colums.pop()
      }

      return colums
    } else {
      return [adress.c]
    }
  },

  getIndexSubColsOfCols(nameColList) {
    return nameColList.reduce((acc, it) => {
      acc[it] = this.getColumsCell(it)
      return acc
    }, {})
  },

  getSubRowDayObj() {
    const subRowDayObj = {}
    const daysAdress = this.getDaysAdress()

    for (const day in daysAdress) {
      const adressCell = daysAdress[day]
      const mergedRange = this.getMergedRange(adressCell)

      if (mergedRange) {
        subRowDayObj[day] = this.getObjSubRowMergedDay(mergedRange)
      } else {
        subRowDayObj[day] = this.getObjSubRowDay(adressCell)
      }
    }

    return subRowDayObj
  },

  getDaysAdress() {
    const daysAdress = {}

    const days = new Array(31)
      .fill(null)
      .map((_, i) => (i < 9 ? `0${i + 1}` : `${i + 1}`))

    for (const a1Adress in this.worksheet) {
      // eslint-disable-next-line no-prototype-builtins
      if (!this.worksheet.hasOwnProperty(a1Adress)) continue
      if (a1Adress[0] !== 'A' || isNaN(Number(a1Adress[1]))) continue

      const cell = this.worksheet[a1Adress]

      // eslint-disable-next-line no-prototype-builtins
      if (!daysAdress.hasOwnProperty(cell.w) && days.includes(cell.w)) {
        daysAdress[cell.w] = utils.decode_cell(a1Adress)
      }
    }

    return daysAdress
  },

  getObjSubRowMergedDay(mergedRange) {
    const rowsIndex = new Array(mergedRange.e.r - mergedRange.s.r + 1)
      .fill(null)
      .map((_, i) => mergedRange.s.r + i)

    return rowsIndex.reduce((acc, it) => {
      const cell = this.getCell({
        r: it,
        c: mergedRange.s.c + 1
      })
      acc[cell.v] = it

      return acc
    }, {})
  },

  /**
   * на случай если есть строка без подстрок
   */
  getObjSubRowDay(adressCell) {
    const cell = this.getCell({
      r: adressCell.r,
      c: adressCell.c + 1
    })

    return { [cell.v]: adressCell.r }
  },

  getResult(indexSubColsOfCols, subRowDayObj) {
    const result = {}

    for (const colTitle in indexSubColsOfCols) {
      const indexSubCols = indexSubColsOfCols[colTitle]

      result[colTitle] = this.getDataCol(indexSubCols, subRowDayObj)
    }

    return result
  },

  getDataCol(indexSubCols, subRowDayObj) {
    const dataCol = {}

    for (const dayNumber in subRowDayObj) {
      const propsWithIndexRows = subRowDayObj[dayNumber]

      const dataSubCols = indexSubCols.reduce((acc, colIndex) => {
        const dataWell = this.getDataWell(propsWithIndexRows, colIndex)
        if (dataWell) acc.push(dataWell)

        return acc
      }, [])

      if (dataSubCols.length > 0) {
        dataCol[dayNumber] = dataSubCols
      }
    }

    return dataCol
  },

  getDataWell(propsWithIndexRows, colIndex) {
    const dataWell = {}

    for (const props in propsWithIndexRows) {
      const cell = this.getCell({
        r: propsWithIndexRows[props],
        c: colIndex
      })

      if (cell) dataWell[props] = cell.w
    }

    return Object.keys(dataWell).length !== 0 ? dataWell : null
  },

  getCell(adress) {
    const a1Address = utils.encode_cell(adress)

    return this.worksheet[a1Address]
  }
}

export default parsingXLSX
