1. Частично добавлен импорт данных из сводного отчёта УСОИ.

- Корректировка запускного дебита не отображается. В дату запуска садится не запускной, а сразу скорректированный дебит
- Рост ПП (план) абсолют больше чем в графике на 0,8тн. Необходимо понять природу ошибки и впоследствии выяснить масштаб (тест на данных апреля  месяца)
- При тесте Апреля не грузится факт по ЗБС за 22.04.24 скв 572 Вынгап и за 23.04.24 4015 Сут, 29.04.24 5195 Вынгап (вероятно, не тянет мероприятия из состояния "Консервация")
- Необходимо разработать перевод в ППД факт: Выход и простоя -> Рост ПП + Перевод в ППД

2. Cинхронизации с АПД (в факт с текущего дня включительно)

3. Перенос/копирование скважин из одной даты на другую. Механизм динамического увеличения столбцов в разделе. Правый крайний пустой - в нём там есть ошибка

4. Механизм сохранения/ открытия исторического прогноза, работа с историческими данными (прогнозы прошлых периодов)