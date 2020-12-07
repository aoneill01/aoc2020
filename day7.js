import getInput from './getInput.js'

const input = await getInput(7)

function parseLine(line) {
  const match = /(?<adj>\w+) (?<color>\w+) bags contain (?<rest>.*)+/.exec(line)
  const contents = match.groups.rest === 'no other bags.' ? null : match.groups.rest.split(', ').map(parseContent)
  return {
    outer: {
      adj: match.groups.adj,
      color: match.groups.color,
    },
    contents,
  }
}

function parseContent(content) {
  const match = /(?<count>\d+) (?<adj>\w+) (?<color>\w+) bag/.exec(content)
  return {
    count: +match.groups.count,
    adj: match.groups.adj,
    color: match.groups.color,
  }
}

const rules = input.map(parseLine)

// Part 1
function canContain(adj, color) {
  const matchingRules = rules.filter((rule) =>
    rule.contents?.some((content) => content.adj === adj && content.color === color)
  )
  return [
    ...matchingRules.map((rule) => ({ adj: rule.outer.adj, color: rule.outer.color })),
    ...matchingRules.flatMap((rule) => canContain(rule.outer.adj, rule.outer.color)),
  ]
}

const uniqueBags = new Set(canContain('shiny', 'gold').map((bag) => `${bag.adj} ${bag.color}`))
console.log('Part 1', uniqueBags.size)

// Part 2
function countBags(adj, color) {
  const matchingRule = rules.find((rule) => rule.outer.adj === adj && rule.outer.color === color)
  if (!matchingRule.contents) return 0
  return matchingRule.contents
    .map((content) => content.count + content.count * countBags(content.adj, content.color))
    .reduce((acc, val) => acc + val, 0)
}

console.log('Part 2', countBags('shiny', 'gold'))
