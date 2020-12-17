import getInput from './getInput.js'

let input = await getInput(16)

const rules = []
let i = 0
while (true) {
  const line = input[i]
  if (line === '') break
  const match = /(?<name>.*): (?<min1>\d+)-(?<max1>\d+) or (?<min2>\d+)-(?<max2>\d+)/.exec(line)
  rules.push({
    name: match.groups.name,
    isValid: (value) =>
      (value >= +match.groups.min1 && value <= +match.groups.max1) ||
      (value >= +match.groups.min2 && value <= +match.groups.max2),
  })
  i++
}

i += 2
const myTicket = input[i].split(',').map((value) => +value)

i += 3
const nearbyTickets = []
for (; i < input.length; i++) {
  nearbyTickets.push(input[i].split(',').map((value) => +value))
}

// Part 1
const result1 = nearbyTickets
  .flat()
  .reduce((acc, value) => (rules.some((rule) => rule.isValid(value)) ? acc : acc + value), 0)
console.log('Part 1', result1)

// Part 2
function isValidTicket(ticket) {
  return ticket.every((value) => rules.some((rule) => rule.isValid(value)))
}

const validTickets = nearbyTickets.filter(isValidTicket)
const ticketsByValidRules = validTickets.map((ticket) =>
  ticket.map((value) => new Set(rules.filter((rule) => rule.isValid(value)).map((rule) => rule.name)))
)

const intersectionOfValidRules = ticketsByValidRules.reduce((acc, ruleTicket) => {
  const result = []
  for (const i in acc) {
    result[i] = new Set([...acc[i]].filter((x) => ruleTicket[i].has(x)))
  }
  return result
}, ticketsByValidRules[0])

const solvedRules = []
while (solvedRules.length < intersectionOfValidRules.length) {
  const [i, match] = Object.entries(intersectionOfValidRules).find(([i, set]) => set.size === 1)
  const [ruleName] = match.values()
  intersectionOfValidRules.forEach((set) => set.delete(ruleName))
  solvedRules.push({ index: i, name: ruleName })
}

const result2 = solvedRules
  .filter(({ name }) => name.includes('departure'))
  .reduce((acc, { index }) => acc * myTicket[index], 1)
console.log('Part 2', result2)
