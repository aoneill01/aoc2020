import getInput from './getInput.js'

let input = await getInput(19)

function parseRule(line) {
  const [id, rule] = line.split(': ')
  const match = /"(.)"/.exec(rule)
  if (match) {
    return {
      id,
      value: match[1],
    }
  }
  const rules = rule.split(' | ').map((ids) => ids.split(' '))
  return {
    id,
    rules,
  }
}

function remainders(input, rule) {
  if (rule.value) {
    if (rule.value === input[0]) {
      return {
        match: true,
        remainders: [input.substring(1)],
      }
    }
    return {
      match: false,
    }
  }

  const rems = rule.rules.map((ids) => remaindersForSequence(input, ids)).filter((rem) => rem.match)

  if (rems.length === 0) {
    return {
      match: false,
    }
  }

  return {
    match: true,
    remainders: rems.flatMap((rem) => rem.remainders),
  }
}

function remaindersForSequence(input, ids) {
  let result = [input]
  for (let id of ids) {
    const rems = result.map((input) => remainders(input, rules.get(id))).filter((rem) => rem.match)

    if (rems.length === 0) {
      return {
        match: false,
      }
    }

    result = rems.flatMap((rem) => rem.remainders)
  }
  return {
    match: true,
    remainders: result,
  }
}

function isValid(input, rule) {
  const rem = remainders(input, rule)
  return rem.match && rem.remainders.includes('')
}

let i = 0
const rules = new Map()
while (true) {
  const line = input[i]
  if (line === '') break
  const rule = parseRule(line)
  rules.set(rule.id, rule)
  i++
}
i++

function validCount() {
  let sum = 0
  for (let j = i; j < input.length; j++) {
    if (isValid(input[j], rules.get('0'))) sum++
  }
  return sum
}

// Part 1
console.log('Part 1', validCount())

// Part 2
const replacements = ['8: 42 | 42 8', '11: 42 31 | 42 11 31']
replacements.forEach((line) => {
  const rule = parseRule(line)
  rules.set(rule.id, rule)
})

console.log('Part 2', validCount())
