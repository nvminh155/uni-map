import { create } from "zustand";

type Target = {
  latlng: L.LatLngExpression;
  name: string;
  description: string;
}

interface MarkerTargetState {
  target: Target | null;
  setTarget: (target: Target) => void;
}

// ✅ typed store
const useMarkerTarget = create<MarkerTargetState>((set) => ({
  target: {
    latlng: [0, 0],
    name: "",
    description: "",
  },
  setTarget: (target) => set({ target }),
}));

export default useMarkerTarget;
