// Usage: npx ts-node scripts/generatePeople.ts <count>
// Generates a people dataset as described and writes to people.generated.json
// Requires: npm install faker@5.5.3 @types/node ts-node typescript

import fs from 'fs'
import faker from 'faker'

interface Address {
  street: string
  city: string
  state: string
  zip: string
  country: {
    code: string
    name: string
    id: string
  }
  type: string
}

interface Phone {
  number: string
  type: string
}

interface Kid {
  name: string
  age: number
}

interface SocialProfile {
  platform: string
  handle: string
}

interface Pet {
  type: string
  name: string
  age: number
}

interface Education {
  degree: string
  field: string
  institution: string
  year: number
}

interface Certification {
  name: string
}

interface Membership {
  name: string
}

interface EmergencyContact {
  name: string
  relation: string
  phone: string
}

interface Person {
  id: string
  title: string
  gender: string
  firstName: string
  lastName: string
  middleName?: string
  nickname?: string
  suffix?: string
  phone: Phone[]
  age: number
  birthdate: string
  married: string
  spouse: string
  address: Address[]
  hobbies: string[]
  'credit-card': string
  kids: Kid[]
  socialProfiles: SocialProfile[]
  favoriteFoods: string[]
  skills: string[]
  languages: string[]
  pets: Pet[]
  education: Education[]
  certifications: string[]
  memberships: string[]
  personalityType: string
  emergencyContacts: EmergencyContact[]
  email: string
  job: string
  salary: number
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomArray<T>(fn: () => T, min: number, max: number): T[] {
  const n = randomInt(min, max)
  return Array.from({ length: n }, fn)
}

function randomHobbies(): string[] {
  const hobbies = [
    'reading',
    'traveling',
    'cooking',
    'cycling',
    'swimming',
    'gaming',
    'photography',
    'yoga',
    'hiking',
    'painting',
    'music',
    'dancing',
    'writing',
    'gardening',
    'coding',
    'sports',
    'volunteering',
    'blogging',
    'crafting',
    'birdwatching',
    'collecting',
    'brewing',
    'debate',
    'model trains',
    'urban sketching',
    'ceramics',
    'kite surfing',
    'beer brewing',
    'sustainability workshops',
    'mountain biking',
    'diving',
    'conservation',
    'street photography',
    'winemaking',
    'landscape photography',
    'education reform',
    'restoring furniture',
    'rugby',
    'football',
    'esports',
    'yachting',
    'design blogging',
    'retro gaming',
    'manga collecting',
    'anime',
  ]
  return faker.helpers.shuffle(hobbies).slice(0, randomInt(1, 10))
}

function randomAddresses(): Address[] {
  const types = ['home', 'work', 'office', 'vacation', 'other']
  const n = randomInt(1, 3)
  const chosenTypes = faker.helpers.shuffle(types).slice(0, n)
  return chosenTypes.map((type) => ({
    street: faker.address.streetAddress(),
    city: faker.address.city(),
    state: faker.address.state(),
    zip: faker.address.zipCode(),
    country: {
      code: faker.address.countryCode(),
      name: faker.address.country(),
      id: faker.address.countryCode(),
    },
    type,
  }))
}

function randomPhones(): Phone[] {
  const types = ['mobile', 'home', 'work', 'office']
  const n = randomInt(1, 2)
  const chosenTypes = faker.helpers.shuffle(types).slice(0, n)
  return chosenTypes.map((type) => ({
    number: faker.phone.phoneNumber(),
    type,
  }))
}

function randomKids(): Kid[] {
  return randomArray(
    () => ({
      name: faker.name.firstName(),
      age: randomInt(1, 25),
    }),
    0,
    5,
  )
}

function randomSocialProfiles(): SocialProfile[] {
  const platforms = ['Twitter', 'Facebook', 'Instagram', 'LinkedIn', 'VK']
  return randomArray(
    () => ({
      platform: faker.helpers.randomize(platforms),
      handle: faker.internet.userName(),
    }),
    0,
    2,
  )
}

function randomFavoriteFoods(): string[] {
  const foods = [
    'pizza',
    'sushi',
    'ramen',
    'shawarma',
    'hummus',
    'fondue',
    'gelato',
    'risotto',
    'dal makhani',
    'samosa',
    'poutine',
    'maple syrup',
    'pelmeni',
    'blini',
    'koshari',
    'molokhia',
    'stroopwafel',
    'haring',
    'empanadas',
    'asado',
    'sauerkraut',
    'pretzel',
    "shepherd's pie",
    'soda bread',
    'baklava',
    'kebap',
    'ceviche',
    'braai',
    'pap',
    'kimchi',
    'bibimbap',
    'ceviche',
    'scallops',
    'tacos',
    'burritos',
    'noodles',
    'curry',
    'salad',
    'steak',
    'chicken',
    'fish',
    'lamb',
    'duck',
  ]
  return faker.helpers.shuffle(foods).slice(0, randomInt(1, 5))
}

function randomSkills(): string[] {
  const skills = [
    'JavaScript',
    'Python',
    'game development',
    'interior design',
    'project management',
    'quantitative analysis',
    'finance',
    'winemaking',
    'marketing',
    'school management',
    'leadership',
    'urban planning',
    'GIS',
    'architecture',
    'restoration',
    'education consulting',
    'public speaking',
    'renewable energy',
    'engineering',
    'photography',
    'editing',
    'research',
    'biology',
    'UX research',
    'design',
    'healthcare administration',
    'sustainability consulting',
  ]
  return faker.helpers.shuffle(skills).slice(0, randomInt(1, 5))
}

function randomLanguages(): string[] {
  const langs = [
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Dutch',
    'Russian',
    'Hindi',
    'Turkish',
    'Zulu',
    'Korean',
    'Japanese',
    'Arabic',
    'Irish',
    'Portuguese',
    'Mandarin',
    'Cantonese',
  ]
  return faker.helpers.shuffle(langs).slice(0, randomInt(1, 3))
}

function randomPets(): Pet[] {
  const types = ['dog', 'cat', 'bird', 'fish', 'hamster', 'rabbit', 'turtle']
  return randomArray(
    () => ({
      type: faker.helpers.randomize(types),
      name: faker.name.firstName(),
      age: randomInt(1, 15),
    }),
    0,
    2,
  )
}

function randomEducation(): Education[] {
  const degrees = ['BA', 'BS', 'MA', 'MSc', 'PhD', 'MBA', 'MArch', 'MUP']
  const fields = [
    'Computer Science',
    'Interior Design',
    'Finance',
    'Viticulture',
    'Education',
    'Urban Planning',
    'Architecture',
    'Healthcare',
    'Biology',
    'Design',
    'Game Design',
    'Marine Biology',
    'Sustainability',
    'Photography',
  ]
  return randomArray(
    () => ({
      degree: faker.helpers.randomize(degrees),
      field: faker.helpers.randomize(fields),
      institution: faker.company.companyName(),
      year: randomInt(1980, 2023),
    }),
    0,
    2,
  )
}

function randomCertifications(): string[] {
  const certs = [
    'Unity Certified Developer',
    'LEED Green Associate',
    'CFA Level 2',
    'Sommelier',
    'Education Leadership',
    'LEED AP',
    'Russian Architects Union',
    'Education Consultant',
    'Solar Energy',
    'Adobe Photoshop',
    'Lab Safety',
    'Adobe XD',
    'Healthcare Management',
    'Unity Certified Producer',
    'Scuba Diving',
  ]
  return faker.helpers.shuffle(certs).slice(0, randomInt(0, 2))
}

function randomMemberships(): string[] {
  const memberships = [
    'Japan Game Developers Association',
    'Dubai Design Association',
    'Swiss Finance Association',
    'Italian Winemakers Association',
    'Indian Principals Association',
    'Canadian Urban Planners Association',
    'Russian Architects Association',
    'Egyptian Educators Association',
    'Dutch Engineers Association',
    'Argentine Photographers Association',
    'German Biology Association',
    'Turkish Designers Association',
    'South African Healthcare Association',
    'Korean Game Producers Association',
    'Chilean Marine Biologists Association',
    'Irish Sustainability Association',
  ]
  return faker.helpers.shuffle(memberships).slice(0, randomInt(0, 2))
}

function randomPersonalityType(): string {
  const types = [
    'INTP',
    'ENFP',
    'INTJ',
    'ESFP',
    'INFJ',
    'ISTP',
    'ISTJ',
    'ENTP',
    'ISFP',
    'ESTJ',
    'INFP',
    'ISFJ',
  ]
  return faker.helpers.randomize(types)
}

function randomEmergencyContacts(): EmergencyContact[] {
  return randomArray(
    () => ({
      name: faker.name.findName(),
      relation: faker.helpers.randomize([
        'father',
        'mother',
        'wife',
        'husband',
        'partner',
        'parent',
        'child',
        'friend',
      ]),
      phone: faker.phone.phoneNumber(),
    }),
    1,
    2,
  )
}

function randomNames(): {
  firstName: string
  lastName: string
  middleName?: string
  nickname?: string
  suffix?: string
} {
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()
  const middleName = Math.random() < 0.5 ? faker.name.firstName() : undefined
  const nickname = Math.random() < 0.3 ? faker.internet.userName() : undefined
  const suffix = Math.random() < 0.2 ? faker.name.suffix() : undefined
  return { firstName, lastName, middleName, nickname, suffix }
}

function makePerson(id: number): Person {
  const names = randomNames()
  return {
    id: `r${id + 1}`,
    title: faker.name.prefix(),
    gender: faker.helpers.randomize(['M', 'F', 'O']),
    ...names,
    phone: randomPhones(),
    age: randomInt(18, 65),
    birthdate: faker.date.past(65, new Date('2007-01-01')).toISOString().slice(0, 10),
    married: faker.helpers.randomize(['single', 'married', 'defacto']),
    spouse: Math.random() < 0.5 ? faker.name.findName() : '',
    address: randomAddresses(),
    hobbies: randomHobbies(),
    'credit-card': faker.finance.creditCardNumber(),
    kids: randomKids(),
    socialProfiles: randomSocialProfiles(),
    favoriteFoods: randomFavoriteFoods(),
    skills: randomSkills(),
    languages: randomLanguages(),
    pets: randomPets(),
    education: randomEducation(),
    certifications: randomCertifications(),
    memberships: randomMemberships(),
    personalityType: randomPersonalityType(),
    emergencyContacts: randomEmergencyContacts(),
    email: faker.internet.email(names.firstName, names.lastName),
    job: faker.name.jobTitle(),
    salary: randomInt(30000, 200000),
  }
}

function main() {
  if (process.argv.length < 3) {
    console.error('Usage: ts-node generatePeople.ts <count> [<fileName>]')
    process.exit(1)
  }
  const count = parseInt(process.argv[2], 10) || 35
  const fileName = process.argv[3] || 'people.generated.json'
  const people: Person[] = Array.from({ length: count }, (_, i) => makePerson(i))
  fs.writeFileSync(fileName, JSON.stringify(people, null, 2))
  console.log(`Generated ${count} people to ${fileName}`)
}

main()
