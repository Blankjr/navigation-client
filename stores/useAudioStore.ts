import { create } from 'zustand';

interface AudioState {
  speechRate: number;
  setSpeechRate: (rate: number) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  speechRate: 1.0, // Default speech rate
  setSpeechRate: (rate) => set({ speechRate: rate }),
}));