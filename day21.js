import getInput from './getInput.js'

const input = (await getInput(21)).map(parseIngredients)

function parseIngredients(line) {
  const { ingredientList, alergenList } = line.match(/(?<ingredientList>.*) \(contains (?<alergenList>.*)\)/).groups
  return {
    ingredients: new Set(ingredientList.split(' ')),
    alergens: new Set(alergenList.split(', ')),
  }
}

const intersection = (set1, set2) => new Set([...set1].filter((value) => set2.has(value)))

const alergenDeductions = input.reduce((acc, { ingredients, alergens }) => {
  for (const alergen of alergens) {
    if (acc.has(alergen)) {
      acc.set(alergen, intersection(acc.get(alergen), ingredients))
    } else {
      acc.set(alergen, new Set(ingredients))
    }
  }
  return acc
}, new Map())

const alergenToIngredient = new Map()
while (alergenDeductions.size > 0) {
  for (const [alergen, ingredients] of alergenDeductions.entries()) {
    if (ingredients.size === 1) {
      alergenToIngredient.set(alergen, [...ingredients][0])
      alergenDeductions.delete(alergen)
    }
    ;[...alergenToIngredient.values()].forEach((alergen) => ingredients.delete(alergen))
  }
}
const knownAlergens = new Set([...alergenToIngredient.values()])

// Part 1
const part1 = input
  .flatMap(({ ingredients }) => [...ingredients])
  .filter((ingredient) => !knownAlergens.has(ingredient)).length

console.log('Part 1', part1)

// Part 2
const part2 = [...alergenToIngredient.entries()]
  .sort(([alergen1], [alergen2]) => {
    if (alergen1 < alergen2) return -1
    if (alergen1 > alergen2) return 1
    return 0
  })
  .map(([alergen, ingredient]) => ingredient)
  .join(',')

console.log('Part 2', part2)
