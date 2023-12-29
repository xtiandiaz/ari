import * as readline from 'readline'

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
