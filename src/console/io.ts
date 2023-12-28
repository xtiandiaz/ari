import * as readline from 'readline'

export enum OutputColor {
  Red = '31m',
  Green = '32m',
  Yellow = '33m',
  Magenta = '35m',
  Gray = '90m'
}

const rli = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

export function askForInput<T>(query: string, convert: (input: string) => T): Promise<T> {
  return new Promise((rslv, rjct) => {    
    rli.question(query, (input) => {
      try {
        rslv(convert(input))
      } catch(error) {
        rjct(error)
      }
    })
  })
}

export function close(): void {
  rli.close()
}
