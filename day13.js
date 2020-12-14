import getInput from './getInput.js'

let [earliestTimestamp, busList] = await getInput(13)
earliestTimestamp = +earliestTimestamp

// Part 1
const busIds = busList
  .split(',')
  .map((busId) => +busId)
  .filter(Boolean)
const [first, ...rest] = busIds.map((busId) => ({ busId, remainder: (busId - (earliestTimestamp % busId)) % busId }))
const earliest = rest.reduce((min, bus) => (bus.remainder < min.remainder ? bus : min), first)
console.log('Part 1', earliest.busId * earliest.remainder)

// Part 2
const buses = busList.split(',')
let time = 0
let Δ = +buses[0]

for (let i = 1; i < buses.length; i++) {
  if (buses[i] === 'x') continue

  const busId = +buses[i]
  while ((time + i) % busId !== 0) {
    time += Δ
  }

  Δ *= busId
}

console.log('Part 2', time)
