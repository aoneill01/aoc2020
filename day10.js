import getInput from './getInput.js'

const input = (await getInput(10)).map((v) => +v).sort((a, b) => a - b)

// Part 1
let voltage = 0
let oneVolts = 0
let threeVolts = 0
for (const charger of input) {
  const diff = charger - voltage
  if (diff === 1) oneVolts++
  if (diff === 3) threeVolts++
  voltage = charger
}
threeVolts++
console.log('Part 1', oneVolts * threeVolts)

// Part 2
const memo = {}
function countCombinations(startIndex) {
  if (startIndex === input.length) return 1
  if (memo[startIndex]) return memo[startIndex]

  const voltage = startIndex === 0 ? 0 : input[startIndex - 1]
  let result = 0

  for (let i = startIndex; i < input.length && input[i] - voltage <= 3; i++) {
    result += countCombinations(i + 1)
  }

  memo[startIndex] = result
  return result
}

console.log('Part 2', countCombinations(0))
