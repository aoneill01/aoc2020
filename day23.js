class Cup {
  constructor(value) {
    this.value = value
    this.next = null
  }

  pullNextThree() {
    const result = this.next
    this.next = this.next.next.next.next
    result.next.next.next = null
    return result
  }

  insertNextThree(pulled) {
    pulled.next.next.next = this.next
    this.next = pulled
  }

  contains(value) {
    if (this.value === value) return true
    if (this.next) return this.next.contains(value)
    return false
  }
}

class Game {
  constructor(input, isPart2 = false) {
    const cupCount = isPart2 ? 1000000 : 9
    const [first, ...rest] = input.split('')
    this.current = new Cup(parseInt(first))

    let last = rest.reduce((acc, value) => (acc.next = new Cup(parseInt(value))), this.current)

    if (isPart2) {
      for (let value = 10; value <= 1000000; value++) {
        last = last.next = new Cup(value)
      }
    }

    last.next = this.current

    this.valueToCup = new Map()
    let tmp = this.current
    for (let i = 0; i < cupCount; i++) {
      this.valueToCup.set(tmp.value, tmp)
      tmp = tmp.next
    }

    this.decrementCupValue = (value) => (value === 1 ? cupCount : value - 1)
  }

  doStep() {
    let pulled = this.current.pullNextThree()
    let destinationValue = this.current.value
    do {
      destinationValue = this.decrementCupValue(destinationValue)
    } while (pulled.contains(destinationValue))
    this.valueToCup.get(destinationValue).insertNextThree(pulled)
    this.current = this.current.next
  }
}

const input = '463528179'

// Part 1
const part1 = new Game(input)

for (let i = 0; i < 100; i++) {
  part1.doStep()
}

let tmp = part1.valueToCup.get(1)
tmp = tmp.next
let result = ''
for (let i = 0; i < 8; i++) {
  result += tmp.value
  tmp = tmp.next
}
console.log('Part 1', result)

// Part 2
const part2 = new Game(input, true)

for (let i = 0; i < 10000000; i++) {
  part2.doStep()
}

tmp = part2.valueToCup.get(1)
console.log('Part 2', tmp.next.value * tmp.next.next.value)
