import getInput from './getInput.js'

const input = await getInput(6)

const groups = []
let currentGroup = []
for (const line of input) {
  if (line === '') {
    groups.push(currentGroup)
    currentGroup = []
    continue
  }
  currentGroup.push([...line])
}
groups.push(currentGroup)

function sum(array) {
  return array.reduce((acc, val) => acc + val, 0)
}

// Part 1
function getGroupYesCountPart1(group) {
  const uniqueQuestions = new Set()
  group.forEach((form) => form.forEach((question) => uniqueQuestions.add(question)))
  return uniqueQuestions.size
}

console.log('Part 1', sum(groups.map(getGroupYesCountPart1)))

// Part 2
function getGroupYesCountPart2(group) {
  const [firstForm, ...otherForms] = group
  return firstForm.filter((question) => otherForms.every((form) => form.includes(question))).length
}

console.log('Part 2', sum(groups.map(getGroupYesCountPart2)))
