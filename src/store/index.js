import { create } from "zustand";

export const useUser = create((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
}));

export const useUserPage = create((set) => ({
  data: null,
  setData: (data) => set(() => ({ data })),
  updateData: (data) =>
    set((prev) => ({ data: prev.length ? [data, ...prev] : [data] })),
}));

export const useDataStore = create((set) => ({
  data: [],
  setData: (data) => set(() => ({ data })),
  updateData: (data) =>
    set((prev) => ({ data: prev.length ? [data, ...prev] : [data] })),
}));
