import { defineStore } from 'pinia'
import { allOperators } from '@/models/math'

export default defineStore('settings', () => {
  const playableOperators = allOperators
  
  return {
    playableOperators,
  }
})
