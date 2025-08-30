import { create } from "zustand";

interface MarkerTargetState {
  target: L.LatLngExpression | null;
  setTarget: (target: L.LatLngExpression) => void;
}

// ✅ typed store
const useMarkerTarget = create<MarkerTargetState>((set) => ({
  target: null,
  setTarget: (target) => set({ target }),
}));

export default useMarkerTarget;
