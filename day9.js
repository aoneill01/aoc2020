import getInput from './getInput.js'

const input = (await getInput(9)).map((v) => +v)

// Part 1
function isValid(i) {
  const value = input[i]
  for (let j = i - 25; j < i - 1; j++) {
    for (let k = j + 1; k < i; k++) {
      if (input[j] + input[k] === value && input[j] !== input[k]) return true
    }
  }
  return false
}

let invalidNumber
for (let i = 25; i < input.length; i++) {
  if (!isValid(i)) {
    invalidNumber = input[i]
    break
  }
}

console.log('Part 1', invalidNumber)

// Part 2
outer: for (let minIndex = 0; minIndex < input.length - 1; minIndex++) {
  let sum = input[minIndex]
  for (let maxIndex = minIndex + 1; maxIndex < input.length && sum < invalidNumber; maxIndex++) {
    sum += input[maxIndex]
    if (sum === invalidNumber) {
      const range = input.slice(minIndex, maxIndex + 1)
      const min = Math.min(...range)
      const max = Math.max(...range)
      console.log('Part 2', min + max)
      break outer
    }
  }
}
