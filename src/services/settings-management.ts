import type { Settings } from '@/models/settings'
import useGameStore from '@/stores/game'
import { retrieve, save } from '@/assets/tungsten/local-storage'

export function retrieveSavedSettings(): Settings | undefined {
  return retrieve<Settings>('settings')
}

export function saveSettings() {
  save('settings', useGameStore().settings)
}
