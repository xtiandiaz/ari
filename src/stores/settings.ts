import { defineStore } from 'pinia'
import { Operator } from '@/models/math'

export default defineStore('settings', () => {
  const playableOperators = [Operator.Addition, Operator.Subtraction, Operator.Multiplication, Operator.Division]
  
  return {
    playableOperators
  }
})
