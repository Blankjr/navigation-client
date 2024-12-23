import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NavigationState {
  isVisualMode: boolean;
  setVisualMode: (isVisual: boolean) => void;
}

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set) => ({
      isVisualMode: true,
      setVisualMode: (isVisual) => set({ isVisualMode: isVisual }),
    }),
    {
      name: 'navigation-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);