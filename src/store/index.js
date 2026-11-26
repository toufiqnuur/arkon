import { create } from "zustand";

export const useUserPage = create((set) => ({
  data: null,
  setData: (data) => set(() => ({ data })),
  updateData: (data) =>
    set((prev) => ({
      data: prev.data?.length ? [data, ...prev.data] : [data],
    })),
}));

export const useDataStore = create((set) => ({
  data: [],
  setData: (data) => set(() => ({ data })),
  updateData: (data) =>
    set((prev) => ({
      data: prev.data?.length ? [data, ...prev.data] : [data],
    })),
}));
