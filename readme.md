# Цифровизация прогноза добычи
Прототип системы "Цифровизация прогноза добычи". 
Первая итерация: 
- использование расчётных данных из Excel-выгрузок
- UI-компоненты для последующей интеграции с API источников данных

## Установка и запуск
```
$ npm i
$ npm start
```

## Используемые библиотеки

- Consta (UI-компоненты https://consta.design/)
- Ag-grid (основная таблица https://www.ag-grid.com/)
- Zustand (хранение состояний https://docs.pmnd.rs/zustand/getting-started/introduction)


## Файлы для проверки

Загрузить РГД

```
/src/store/data/rgd2 - апрель.xlsx 
```

Загрузить УСОИ
``` 
/src/store/data/УСОИ - апрель.xlsx
```

## Доступный функционал
- Импорт таблиц РГД и УСОИ
- Перерасчёт итоговых столбцов в соответствии с формулами Excel при изменении данных в ячейках
- Функции "Вырезать", "Копировать", "Вставить", "Удалить" в ячеейках с помощью контекстного меню

## Todo:

1. Корректировка запускного дебита не отображается. В дату запуска садится не запускной, а сразу скорректированный дебит
2. Рост ПП (план) абсолют больше чем в графике на 0,8тн. 
3. Cинхронизации с АПД (в факт с текущего дня включительно)
4. Перенос/копирование скважин из одной даты на другую. Механизм динамического увеличения столбцов в разделе. Правый крайний пустой - в нём там есть ошибка
5. Механизм сохранения/ открытия исторического прогноза, работа с историческими данными (прогнозы прошлых периодов)