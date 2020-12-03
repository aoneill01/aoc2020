import getInput from './getInput.js'

const input = await getInput(3)
const width = input[0].length

// Part 1
const deltaX = 3
const part1 = input.reduce(
  ({ treeCount, xPosition }, line) => {
    if (line[xPosition % width] === '#') {
      treeCount++
    }
    return { treeCount, xPosition: xPosition + deltaX }
  },
  { treeCount: 0, xPosition: 0 }
)

console.log('Part 1', part1.treeCount)

// Part 2
const slopes = [
  { right: 1, down: 1 },
  { right: 3, down: 1 },
  { right: 5, down: 1 },
  { right: 7, down: 1 },
  { right: 1, down: 2 },
]

const part2 = slopes.map(countTrees).reduce((acc, count) => acc * count, 1)
console.log('Part 2', part2)

function countTrees(slope) {
  let treeCount = 0
  let xPosition = 0
  for (let row = 0; row < input.length; row += slope.down) {
    if (input[row][xPosition % width] === '#') {
      treeCount++
    }
    xPosition += slope.right
  }
  return treeCount
}
