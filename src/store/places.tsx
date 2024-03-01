import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type Places = {
  id: number;
  name: string;
  select: boolean;
  wells: Array<{
    id: number;
    name: string;
    select: boolean;
  }>
};

export type PlacesStoreType = {
  places: Places[],
  setFilterHeader: (number) => void;
  setFilter: (arg1: number, arg2: number) => void;
}

const useStore = create<PlacesStoreType>()(devtools((set, get) => ({
  places: [
    {
      id: 0,
      name: 'ЦДНГ-1',
      select: true,
      wells: [
        {
          id: 0,
          name: 'Холмогорское',
          select: true
        },
        {
          id: 1,
          name: 'Карамовское',
          select: true
        },
        {
          id: 2,
          name: 'Пограничное',
          select: true
        },
        {
          id: 3,
          name: 'Отдельное',
          select: true
        },
        {
          id: 4,
          name: 'Южно-Ноябрьское',
          select: true
        },
        {
          id: 5,
          name: 'Средне-Тульское',
          select: true
        },
        {
          id: 6,
          name: 'Спорышевское',
          select: true
        }
      ]
    },
    {
      id: 1,
      name: 'ЦДНГ-2',
      select: true,
      wells: [
        {
          id: 0,
          name: 'Восточно-Пякутинское',
          select: true
        },
        {
          id: 1,
          name: 'Крайнее',
          select: true
        },
        {
          id: 2,
          name: 'Суторминское',
          select: true
        },
      ]
    },
    {
      id: 2,
      name: 'ЦДНГ-3',
      select: true,
      wells: [
        {
          id: 0,
          name: 'Сугмутское',
          select: true
        },
        {
          id: 1,
          name: 'Муравленковское',
          select: true
        },
        {
          id: 2,
          name: 'Северо-Янгтинское',
          select: true
        },
        {
          id: 3,
          name: 'Северо-Пямалияхское',
          select: true
        },
        {
          id: 4,
          name: 'Умсейское + Южно-Пурпейское',
          select: true
        },
      ]
    },
    {
      id: 3,
      name: 'ЦДНГ-7',
      select: true,
      wells: [
        {
          id: 0,
          name: 'Вынгапуровское',
          select: true
        },
        {
          id: 1,
          name: 'Новогоднее',
          select: true
        },
        {
          id: 2,
          name: 'Ярайнерское',
          select: true
        }
      ]
    },
    {
      id: 4,
      name: 'ЦДНГ-10',
      select: true,
      wells: [
        {
          id: 0,
          name: 'Еты-Пуровское',
          select: true
        },
        {
          id: 1,
          name: 'Валынтойское',
          select: true
        },
        {
          id: 2,
          name: 'Вынгаяхинское',
          select: true
        }
      ]
    }
  ],
  setFilterHeader: (id) => set(() => 
    ({ places: get().places.map(item => 
      item.id !== id ? item 
        : {
          id: item.id,
          name: item.name,
          wells: item.wells,
          select: !item.select
        })})),
  setFilter: (headerId, id) => set(() => 
    ({ places: get().places.map(item => 
      item.id !== headerId ? item 
        : {
          id: item.id,
          name: item.name,
          wells: item.wells.map(el => el.id !== id ? el :
            {
              id: el.id,
              name: el.name,
              select: !el.select
            }),
          select: item.select
        })}))
}), {enabled: true, name: 'PlacesStore'}))

export {useStore}