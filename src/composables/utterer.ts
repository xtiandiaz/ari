import { ref, watch } from 'vue'
import useGameStore from '@/stores/game'

export function useUtterer() {  
  const settings = useGameStore().settings
  
  const utterance = new SpeechSynthesisUtterance()
  const isUttering = ref(false)
  
  function utter(message: string) {
    utterance.text = message
    
    speechSynthesis.cancel()
    speechSynthesis.speak(utterance)
  }
  
  utterance.addEventListener('start', () => isUttering.value = true)
  utterance.addEventListener('end', () => isUttering.value = false)
  
  watch(() => settings.language, (lang) => {
    utterance.lang = lang
  }, { immediate: true })
  
  return {
    isUttering,
    
    utter,
  }
}
