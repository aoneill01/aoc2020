import getInput from './getInput.js'

const input = (await getInput(11)).map((line) => [...line])
// const test = [
//   'L.LL.LL.LL',
//   'LLLLLLL.LL',
//   'L.L.L..L..',
//   'LLLL.LL.LL',
//   'L.LL.LL.LL',
//   'L.LLLLL.LL',
//   '..L.L.....',
//   'LLLLLLLLLL',
//   'L.LLLLLL.L',
//   'L.LLLLL.LL',
// ]
// const input = test.map((line) => [...line])

function getValue(seatLayout, row, col) {
  if (row < 0 || col < 0 || row >= seatLayout.length || col >= seatLayout[row].length) return 'X'
  return seatLayout[row][col]
}

function formatLayout(seatLayout) {
  return seatLayout.map((row) => row.join('')).join('\n')
}

function occupiedCount(seatLayout) {
  return seatLayout.reduce((rowAcc, row) => row.reduce((cellAcc, cell) => cellAcc + (cell === '#' ? 1 : 0), rowAcc), 0)
}

// Part 1
function step1(seatLayout) {
  const result = seatLayout.map((row) => [])

  for (let row = 0; row < seatLayout.length; row++) {
    for (let col = 0; col < seatLayout[row].length; col++) {
      result[row][col] = newState1(seatLayout, row, col)
    }
  }

  return result
}

function newState1(seatLayout, row, col) {
  const value = getValue(seatLayout, row, col)
  const others = [
    getValue(seatLayout, row - 1, col - 1),
    getValue(seatLayout, row - 1, col),
    getValue(seatLayout, row - 1, col + 1),
    getValue(seatLayout, row, col + 1),
    getValue(seatLayout, row + 1, col + 1),
    getValue(seatLayout, row + 1, col),
    getValue(seatLayout, row + 1, col - 1),
    getValue(seatLayout, row, col - 1),
  ]
  if (value === 'L' && !others.some((v) => v === '#')) return '#'
  if (value === '#' && others.filter((v) => v === '#').length >= 4) return 'L'
  return value
}

let current = input
while (true) {
  const next = step1(current)
  if (formatLayout(current) === formatLayout(next)) {
    console.log('Part 1', occupiedCount(next))
    break
  }
  current = next
}

// Part 2
function step2(seatLayout) {
  const result = seatLayout.map((row) => [])

  for (let row = 0; row < seatLayout.length; row++) {
    for (let col = 0; col < seatLayout[row].length; col++) {
      result[row][col] = newState2(seatLayout, row, col)
    }
  }

  return result
}

function newState2(seatLayout, row, col) {
  const value = getValue(seatLayout, row, col)
  const others = [
    getVisible(seatLayout, row, col, -1, -1),
    getVisible(seatLayout, row, col, -1, 0),
    getVisible(seatLayout, row, col, -1, 1),
    getVisible(seatLayout, row, col, 0, 1),
    getVisible(seatLayout, row, col, 1, 1),
    getVisible(seatLayout, row, col, 1, 0),
    getVisible(seatLayout, row, col, 1, -1),
    getVisible(seatLayout, row, col, 0, -1),
  ]
  if (value === 'L' && !others.some((v) => v === '#')) return '#'
  if (value === '#' && others.filter((v) => v === '#').length >= 5) return 'L'
  return value
}

function getVisible(seatLayout, row, col, rowSlope, colSlope) {
  const value = getValue(seatLayout, row + rowSlope, col + colSlope)
  if (value !== '.') return value
  return getVisible(seatLayout, row + rowSlope, col + colSlope, rowSlope, colSlope)
}

current = input
while (true) {
  const next = step2(current)
  if (formatLayout(current) === formatLayout(next)) {
    console.log('Part 2', occupiedCount(next))
    break
  }
  current = next
}
