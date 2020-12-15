import getInput from './getInput.js'

let input = await getInput(14)

const maskRegex = /mask = (?<mask>[X10]{36})/
const assignmentRegex = /mem\[(?<address>\d+)] = (?<value>\d+)/

const sumMemory = (program) => [...program.memory.values()].reduce((acc, v) => acc + v, 0n)

// Part 1
function processOperation1(line, program) {
  let match = maskRegex.exec(line)
  if (match) {
    const fixedMask = BigInt('0b' + match.groups.mask.replace(/[01]/g, '1').replace(/X/g, '0'))
    const fixedValue = BigInt('0b' + match.groups.mask.replace(/X/g, '0'))
    program.mask = { fixedMask, fixedValue }
    return
  }

  match = assignmentRegex.exec(line)
  if (match) {
    const address = BigInt(match.groups.address)
    const value = BigInt(match.groups.value)
    program.memory.set(address, (value & ~program.mask.fixedMask) | (program.mask.fixedMask & program.mask.fixedValue))
    return
  }

  throw new Error('Unexpected input: ' + line)
}

const program1 = {
  memory: new Map(),
}

input.forEach((line) => processOperation1(line, program1))

console.log('Part 1', sumMemory(program1).toString())

// Part 2
function* addressGenerator(floatingAddress) {
  const binaryDigits = [...floatingAddress]
  const floatingCount = BigInt(binaryDigits.filter((digit) => digit === 'X').length)
  if (floatingCount === 0) {
    return BigInt(`0b${floatingAddress}`)
  }

  for (let iteration = 0n; iteration < 2n ** floatingCount; iteration++) {
    let shift = 0n
    let result = 0n
    for (let digit of binaryDigits) {
      result = result << 1n
      switch (digit) {
        case 'X':
          result |= (iteration >> shift) & 1n
          shift++
          break
        case '1':
          result |= 1n
          break
      }
    }
    yield result
  }
}

function applyMask(address, mask) {
  let result = ''
  for (let i = 0n; i < mask.length; i++) {
    switch (mask[i]) {
      case '0':
        result += ((address >> (35n - i)) & 1n).toString()
        break
      case '1':
      case 'X':
        result += mask[i]
        break
    }
  }
  return result
}

function processOperation2(line, program) {
  let match = maskRegex.exec(line)
  if (match) {
    program.mask = [...match.groups.mask]
    return
  }

  match = assignmentRegex.exec(line)
  if (match) {
    const address = BigInt(match.groups.address)
    const value = BigInt(match.groups.value)
    const maskedAddress = applyMask(address, program.mask)

    for (const address of addressGenerator(maskedAddress)) program.memory.set(address, value)
    return
  }

  throw new Error('Unexpected input: ' + line)
}

const program2 = {
  memory: new Map(),
}

input.forEach((line) => processOperation2(line, program2))

console.log('Part 2', sumMemory(program2).toString())
