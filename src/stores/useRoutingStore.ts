import { create } from "zustand";

interface RoutingStore {
  from: [number, number] | null;
  to: [number, number] | null;
  setFrom: (from: [number, number] | null) => void;
  setTo: (to: [number, number] | null) => void;
}

export const useRoutingStore = create<RoutingStore>((set) => ({
  from: null,
  to: null,
  setFrom: (from: [number, number] | null) => set({ from }),
  setTo: (to: [number, number] | null) => set({ to }),
}));