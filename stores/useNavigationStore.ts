import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NavigationState {
  isVisualMode: boolean;
  setVisualMode: (isVisual: boolean) => void;
  isWlanFingerprinting: boolean;
  setWlanFingerprinting: (isEnabled: boolean) => void;
}

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set) => ({
      isVisualMode: true,
      setVisualMode: (isVisual) => set({ isVisualMode: isVisual }),
      isWlanFingerprinting: false,
      setWlanFingerprinting: (isEnabled) => set({ isWlanFingerprinting: isEnabled }),
    }),
    {
      name: 'navigation-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);