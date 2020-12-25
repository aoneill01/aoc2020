async function singleFileDay(day) {
  console.log(`Day ${day}`)
  await import(`./day${day}.js`)
}

for (let day = 3; day <= 14; day++) {
  await singleFileDay(day)
}

console.log('Day 15')
process.argv[2] = '30000000'
await import('./day15.js')

await singleFileDay(16)

console.log('Day 17')
await import('./day17-1.js')
await import('./day17-2.js')

for (let day = 18; day <= 25; day++) {
  await singleFileDay(day)
}
