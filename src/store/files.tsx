import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
export type File = {
  id: number;
  name: string;
};

export type FilesStoreType = {
  files: File[] | null,
}

const useStore = create<FilesStoreType>()(devtools(() => ({
  files: null
}), {enabled: true, name: 'FilesStore'}))

export {useStore}