import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const createAssistantControlStore = () =>
  create(
    persist(
      (set, get) => ({
        state: 'full', // 'full' | 'minimized' | 'hidden' | 'presentation'
        isVisible: true,
        isVoiceEnabled: true,
        isAnimationsEnabled: true,
        isCameraEnabled: false,
        volume: 0.8,
        speechRate: 1,
        language: 'pt-BR',
        voiceId: import.meta.env.VITE_ELEVENLABS_VOICE_ID || '',
        
        setState: (newState) => {
          const validStates = ['full', 'minimized', 'hidden', 'presentation']
          if (validStates.includes(newState)) {
            set({ state: newState, isVisible: newState !== 'hidden' })
          }
        },
        
        toggleMinimize: () => {
          const current = get().state
          set({
            state: current === 'minimized' ? 'full' : 'minimized',
          })
        },
        
        toggleVisibility: () => {
          const current = get().state
          set({
            state: current === 'hidden' ? 'full' : 'hidden',
            isVisible: current === 'hidden',
          })
        },
        
        toggleVoice: () => set((state) => ({ isVoiceEnabled: !state.isVoiceEnabled })),
        toggleAnimations: () => set((state) => ({ isAnimationsEnabled: !state.isAnimationsEnabled })),
        toggleCamera: () => set((state) => ({ isCameraEnabled: !state.isCameraEnabled })),
        
        setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
        setSpeechRate: (rate) => set({ speechRate: Math.max(0.5, Math.min(2, rate)) }),
        setLanguage: (lang) => set({ language: lang }),
        setVoiceId: (voiceId) => set({ voiceId }),
        
        enterPresentationMode: () => set({ state: 'presentation' }),
        exitPresentationMode: () => set({ state: 'full' }),
      }),
      {
        name: 'assistant-control-storage',
        partialize: (state) => ({
          isVoiceEnabled: state.isVoiceEnabled,
          isAnimationsEnabled: state.isAnimationsEnabled,
          volume: state.volume,
          speechRate: state.speechRate,
          language: state.language,
          voiceId: state.voiceId,
        }),
      }
    )
  )

export const useAssistantControl = createAssistantControlStore()
