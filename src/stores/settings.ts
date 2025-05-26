import { defineStore } from 'pinia'
import { Operator } from '@/models/math'
import { isMobile } from '@/assets/tungsten/navigator'

export default defineStore('settings', () => {
  const playableOperators = [Operator.Addition, Operator.Subtraction, Operator.Multiplication, Operator.Division]
  const maxDigitsPerOperationLine = isMobile() ? 9 : 12
  
  return {
    playableOperators,
    maxDigitsPerOperationLine
  }
})
