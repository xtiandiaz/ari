import { ref } from 'vue'
import useSettingsStore from '@/stores/settings'

export function useUtterer() {
  const settings = useSettingsStore()
  
  const utterance = new SpeechSynthesisUtterance()
  utterance.lang = settings.language
  
  const isUttering = ref(false)
  
  function utter(message: string) {
    utterance.text = message
    
    speechSynthesis.speak(utterance)
  }
  
  utterance.addEventListener('start', () => isUttering.value = true)
  utterance.addEventListener('end', () => isUttering.value = false)
  
  return {
    isUttering,
    
    utter,
  }
}
