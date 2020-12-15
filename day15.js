const startingNumbers = [11, 18, 0, 20, 1, 7, 16]
const seenAt = new Map()
const turnTarget = parseInt(process.argv[2])
if (!turnTarget) {
  console.error('Missing turn target')
  process.exit(1)
}

for (let i = 0; i < startingNumbers.length - 1; i++) {
  seenAt.set(startingNumbers[i], i + 1)
}

let turn = startingNumbers.length + 1
let last = startingNumbers[startingNumbers.length - 1]

while (true) {
  let current = 0
  if (seenAt.has(last)) {
    current = turn - seenAt.get(last) - 1
  }
  if (turn === turnTarget) {
    console.log(`Turn ${turn}: ${current}`)
    break
  }
  seenAt.set(last, turn - 1)
  last = current
  turn++
}
