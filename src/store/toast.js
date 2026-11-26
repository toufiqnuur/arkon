import { create } from "zustand";

const TOAST_DURATION = 4000;
const MAX_TOASTS = 4;

let nextId = 0;

export const useToastStore = create((set, get) => ({
  toasts: [],
  add: (message, type = "info") => {
    const id = ++nextId;

    set((state) => ({
      toasts: [...state.toasts, { id, message, type }].slice(-MAX_TOASTS),
    }));

    setTimeout(() => get().remove(id), TOAST_DURATION);
  },
  remove: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));

export const toast = {
  success: (message) => useToastStore.getState().add(message, "success"),
  error: (message) => useToastStore.getState().add(message, "error"),
  info: (message) => useToastStore.getState().add(message, "info"),
};
