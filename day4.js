import getInput from './getInput.js'

const input = await getInput(4)

const passports = []
let currentPassport = {}
for (const line of input) {
  if (line === '') {
    passports.push(currentPassport)
    currentPassport = {}
    continue
  }
  line
    .split(' ')
    .map(parseData)
    .forEach((kvp) => (currentPassport = { ...currentPassport, ...kvp }))
}
passports.push(currentPassport)

function parseData(data) {
  const [key, value] = data.split(':')
  return { [key]: value }
}

// Part 1
function isValidDay1(passport) {
  const requiredFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']
  const fields = Object.keys(passport)
  return requiredFields.every((requiredField) => fields.includes(requiredField))
}

console.log('Part 1', passports.filter(isValidDay1).length)

// Part 2
function isValidDay2(passport) {
  if (!isValidDay1(passport)) return false
  const valueValidators = [
    validateBirthYear,
    validateIssueYear,
    validateExpirationYear,
    validateHeight,
    validateHairColor,
    validateEyeColor,
    validatePassportId,
  ]
  return valueValidators.every((validator) => validator(passport))
}

function validateYear(value, min, max) {
  if (!/^\d{4}$/.test(value)) return false
  return +value >= min && +value <= max
}

function validateBirthYear(passport) {
  return validateYear(passport.byr, 1920, 2002)
}

function validateIssueYear(passport) {
  return validateYear(passport.iyr, 2010, 2020)
}

function validateExpirationYear(passport) {
  return validateYear(passport.eyr, 2020, 2030)
}

function validateHeight(passport) {
  const match = /(?<val>\d+)(?<units>(in|cm))/.exec(passport.hgt)
  if (!match) return false
  const val = +match.groups.val
  switch (match.groups.units) {
    case 'cm':
      return val >= 150 && val <= 193
    case 'in':
      return val >= 59 && val <= 76
  }
}

function validateHairColor(passport) {
  return /^#[0-9a-f]{6}$/.test(passport.hcl)
}

function validateEyeColor(passport) {
  const validEyeColors = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth']
  return validEyeColors.includes(passport.ecl)
}

function validatePassportId(passport) {
  return /^\d{9}$/.test(passport.pid)
}

console.log('Part 2', passports.filter(isValidDay2).length)
