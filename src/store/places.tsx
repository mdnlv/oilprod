import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type Places = {
  id: number;
  name: string;
  select: boolean;
  open: boolean;
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
  changeFilterOpen: (number) => void;
}

const useStore = create<PlacesStoreType>()(devtools((set, get) => ({
  places: [
    {
      id: 0,
      part: 1,
      name: 'ЦДНГ-1',
      select: true,
      open: false,
      wells: [
        {
          id: 0,
          name: 'Холмогорское',
          select: true,
          code: 'MS0227'
        },
        {
          id: 1,
          name: 'Карамовское',
          select: true,
          code: 'MS0253'
        },
        {
          id: 2,
          name: 'Пограничное',
          select: true,
          code: 'MS0283'
        },
        {
          id: 3,
          name: 'Отдельное',
          select: true,
          code: 'MS0335'
        },
        {
          id: 4,
          name: 'Южно-Ноябрьское',
          select: true,
          code: 'MS0404'
        },
        {
          id: 5,
          name: 'Средне-Итурское',
          select: true,
          code: 'MS0558'
        },
        {
          id: 6,
          name: 'Спорышевское',
          select: true,
          code: 'MS0228'
        },
        {
          id: 7,
          name: 'Источное',
          select: true,
          code: 'MS0603'
        }
      ]
    },
    {
      id: 1,
      part: 2,
      name: 'ЦДНГ-2',
      select: true,
      open: false,
      wells: [
        {
          id: 0,
          name: 'Восточно-Пякутинское',
          select: true,
          code: 'MS0255'
        },
        {
          id: 1,
          name: 'Крайнее',
          select: true,
          code: 'MS0256'
        },
        {
          id: 2,
          name: 'Суторминское',
          select: true,
          code: 'MS0254'
        },
        {
          id: 3,
          name: 'Западно-Суторминско',
          select: true,
          code: 'MS0602'
        },
        {
          id: 4,
          name: 'Новое',
          select: true,
          code: 'MS0235'
        },
      ]
    },
    {
      id: 2,
      part: 2,
      name: 'ЦДНГ-3',
      select: true,
      open: false,
      wells: [
        {
          id: 0,
          name: 'Сугмутское',
          select: true,
          code: 'MS0611'
        },
        {
          id: 1,
          name: 'Муравленковское',
          select: true,
          code: 'MS0237'
        },
        {
          id: 2,
          name: 'Северо-Янгтинское',
          select: true,
          code: 'MS0988'
        },
        {
          id: 3,
          name: 'Северо-Пямалияхское',
          select: true,
          code: 'MS0452'
        },
        {
          id: 4,
          name: 'Умсейское + Южно-Пурпейское',
          select: true,
          code: 'MS0562'
        },
        {
          id: 5,
          name: 'Малопякутинское',
          select: true,
          code: 'MS0551'
        },
        {
          id: 6,
          name: 'Пякутинское',
          select: true,
          code: 'MS0300'
        },
        {
          id: 7,
          name: 'Романовское',
          select: true,
          code: 'MS0613'
        },
      ]
    },
    {
      id: 3,
      part: 1,
      name: 'ЦДНГ-7',
      select: true,
      open: false,
      wells: [
        {
          id: 0,
          name: 'Вынгапуровское',
          select: true,
          code: 'MS0313'
        },
        {
          id: 1,
          name: 'Новогоднее',
          select: true,
          code: 'MS0380'
        },
        {
          id: 2,
          name: 'Ярайнерское',
          select: true,
          code: 'MS0328'
        }
      ]
    },
    {
      id: 4,
      part: 2,
      name: 'ЦДНГ-10',
      select: true,
      open: false,
      wells: [
        {
          id: 0,
          name: 'Еты-Пуровское',
          select: true,
          code: 'MS0563'
        },
        {
          id: 1,
          name: 'Валынтойское',
          select: true,
          code: 'MS0935'
        },
        {
          id: 2,
          name: 'Вынгаяхинское',
          select: true,
          code: 'MS0286'
        }
      ]
    },
    {
      id: 5,
      part: 1,
      name: 'НГДП ОГМ',
      select: true,
      open: false,
      wells: [
        {
          id: 0,
          name: 'Воргенское',
          select: true,
          code: 'MS0931'
        },
        {
          id: 1,
          name: 'Западно-Чатылькинское',
          select: true,
          code: 'MS0640'
        },
        {
          id: 2,
          name: 'Равнинное',
          select: true,
          code: 'MS0178'
        },
        {
          id: 3,
          name: 'Холмистое',
          select: true,
          code: 'MS0728'
        },
        {
          id: 4,
          name: 'Чатылькинское',
          select: true,
          code: 'MS0849'
        },
        {
          id: 5,
          name: 'Южно-Удмуртское',
          select: true,
          code: 'MS0282'
        },
        {
          id: 6,
          name: 'Западно-Ноябрьское',
          select: true,
          code: 'MS0589'
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
          select: !item.select,
          open: item.open
        })})),
  changeFilterOpen: (id) => set(() => 
    ({ places: get().places.map(item => 
      item.id !== id ? item 
        : {
          id: item.id,
          name: item.name,
          wells: item.wells,
          select: item.select,
          open: !item.open
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
          select: item.select,
          open: item.open
        })}))
}), {enabled: true, name: 'PlacesStore'}))

export {useStore}