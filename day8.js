import getInput from './getInput.js'

const input = await getInput(8)

const acc = (arg) => (state) => {
  state.acc += arg
  state.pc++
}

const jmp = (arg) => (state, flip) => {
  if (state.modCount + 1 === flip) {
    return nop(arg)(state)
  }
  state.pc += arg
  state.modCount++
}

const nop = (arg) => (state, flip) => {
  if (state.modCount + 1 === flip) {
    return jmp(arg)(state)
  }
  state.pc++
  state.modCount++
}

const program = input.map((line) => {
  const [op, argStr] = line.split(' ')
  const arg = +argStr
  switch (op) {
    case 'acc':
      return acc(arg)
    case 'jmp':
      return jmp(arg)
    case 'nop':
      return nop(arg)
  }
})

// Part 1
let state = {
  pc: 0,
  acc: 0,
}
let visitedInstructions = new Set()

while (!visitedInstructions.has(state.pc)) {
  visitedInstructions.add(state.pc)
  program[state.pc](state)
}

console.log('Part 1', state.acc)

// Part 2
let flip = 1

do {
  state = {
    pc: 0,
    acc: 0,
    modCount: 0,
  }
  visitedInstructions = new Set()

  while (!visitedInstructions.has(state.pc) && state.pc < program.length) {
    visitedInstructions.add(state.pc)
    program[state.pc](state, flip)
  }

  flip++
} while (state.pc !== program.length)

console.log('Part 2', state.acc)
