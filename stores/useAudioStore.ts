import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AudioState {
  speechRate: number;
  setSpeechRate: (rate: number) => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set) => ({
      speechRate: 1.0,
      setSpeechRate: (rate) => set({ speechRate: rate }),
    }),
    {
      name: 'audio-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);