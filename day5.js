import getInput from './getInput.js'

const input = await getInput(5)

function toSeatId(boardingPass) {
  let binary = boardingPass.replace(/B|R/g, '1').replace(/F|L/g, '0')
  return parseInt(binary, 2)
}

const seatIds = new Set(input.map(toSeatId))

// Part 1
const max = Math.max(...seatIds)
console.log('Part 1', max)

// Part 2
const min = Math.min(...seatIds)
for (let seatId = min + 1; seatId < max; seatId++) {
  if (!seatIds.has(seatId)) {
    console.log('Part 2', seatId)
    break
  }
}
