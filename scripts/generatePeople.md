# People Data Generator Script

Generate realistic demo people data for grid/testing purposes.

## Usage

### With npm script

```bash
npm run generate:people -- <count> [outputFile]
```

- `<count>`: Number of people to generate (default: 35)
- `[outputFile]`: Optional output file path (default: `people.generated.json`)

### Directly with ts-node

```bash
npx ts-node scripts/generatePeople.ts <count> [outputFile]
```

## Examples

Generate 50 people to the default file:

```bash
npm run generate:people -- 50
```

Generate 10 people to a custom file:

```bash
npm run generate:people -- 10 ./src/examples/people.json
```

## Output

The script outputs a JSON array of person objects. Each object may contain the following fields:

| Field             | Type                | Description / Possible Values                                                           |
| ----------------- | ------------------- | --------------------------------------------------------------------------------------- |
| id                | string              | Unique row id (e.g. "r1")                                                               |
| title             | string              | Honorific (e.g. "Mr.", "Ms.", "Dr.")                                                    |
| gender            | string              | "M", "F", "O"                                                                           |
| firstName         | string              | First name                                                                              |
| lastName          | string              | Last name                                                                               |
| middleName        | string (optional)   | Middle name                                                                             |
| nickname          | string (optional)   | Nickname                                                                                |
| suffix            | string (optional)   | Suffix (e.g. "PhD", "MD")                                                               |
| phone             | array of objects    | List of phone numbers                                                                   |
|                   |                     | Each: { number: string, type: string }                                                  |
|                   |                     | type: "mobile", "home", "work", "office"                                                |
| age               | number              | Age (18–65)                                                                             |
| birthdate         | string (YYYY-MM-DD) | Birthdate                                                                               |
| married           | string              | "single", "married", "defacto"                                                          |
| spouse            | string              | Spouse name or empty                                                                    |
| address           | array of objects    | List of addresses                                                                       |
|                   |                     | Each: { street, city, state, zip, country, type }                                       |
|                   |                     | type: "home", "work", "office", "vacation", "other"                                     |
| hobbies           | array of strings    | 1–10 hobbies                                                                            |
| credit-card       | string              | Credit card number                                                                      |
| kids              | array of objects    | Each: { name: string, age: number }                                                     |
| socialProfiles    | array of objects    | Each: { platform: string, handle: string }                                              |
|                   |                     | platform: "Twitter", "Facebook", "Instagram", "LinkedIn", "VK"                          |
| favoriteFoods     | array of strings    | e.g. "pizza", "sushi", "ramen", etc.                                                    |
| skills            | array of strings    | e.g. "JavaScript", "Python", etc.                                                       |
| languages         | array of strings    | e.g. "English", "Spanish", etc.                                                         |
| pets              | array of objects    | Each: { type: string, name: string, age: number }                                       |
|                   |                     | type: "dog", "cat", "bird", "fish", "hamster", "rabbit", "turtle"                       |
| education         | array of objects    | Each: { degree, field, institution, year }                                              |
|                   |                     | degree: "BA", "BS", "MA", "MSc", "PhD", "MBA", "MArch", "MUP"                           |
| certifications    | array of strings    | e.g. "Unity Certified Developer", "LEED AP", etc.                                       |
| memberships       | array of strings    | e.g. "Japan Game Developers Association", etc.                                          |
| personalityType   | string              | e.g. "INTP", "ENFP", "INTJ", etc.                                                       |
| emergencyContacts | array of objects    | Each: { name: string, relation: string, phone: string }                                 |
|                   |                     | relation: "father", "mother", "wife", "husband", "partner", "parent", "child", "friend" |
| email             | string              | Email address                                                                           |
| job               | string              | Job title                                                                               |
| salary            | number              | Salary (30,000–200,000)                                                                 |

### Sample Output

```json
[
  {
    "id": "r1",
    "title": "Ms.",
    "gender": "F",
    "firstName": "Jane",
    "lastName": "Doe",
    "middleName": "Marie",
    "nickname": "jdoe",
    "suffix": "PhD",
    "phone": [
      { "number": "123-456-7890", "type": "mobile" },
      { "number": "987-654-3210", "type": "work" }
    ],
    "age": 42,
    "birthdate": "1983-05-12",
    "married": "married",
    "spouse": "John Doe",
    "address": [
      {
        "street": "123 Main St",
        "city": "Springfield",
        "state": "IL",
        "zip": "62701",
        "country": { "code": "US", "name": "United States", "id": "US" },
        "type": "home"
      },
      {
        "street": "456 Office Rd",
        "city": "Springfield",
        "state": "IL",
        "zip": "62702",
        "country": { "code": "US", "name": "United States", "id": "US" },
        "type": "work"
      }
    ],
    "hobbies": ["reading", "cycling"],
    "credit-card": "1234-5678-9012-3456",
    "kids": [{ "name": "Alice", "age": 10 }],
    "socialProfiles": [{ "platform": "Twitter", "handle": "jdoe" }],
    "favoriteFoods": ["pizza", "sushi"],
    "skills": ["JavaScript", "Python"],
    "languages": ["English", "Spanish"],
    "pets": [{ "type": "dog", "name": "Rex", "age": 3 }],
    "education": [
      {
        "degree": "PhD",
        "field": "Computer Science",
        "institution": "Springfield University",
        "year": 2010
      }
    ],
    "certifications": ["Unity Certified Developer"],
    "memberships": ["Japan Game Developers Association"],
    "personalityType": "INTP",
    "emergencyContacts": [{ "name": "John Doe", "relation": "husband", "phone": "555-123-4567" }]
  "email": "jane.doe@example.com",
  "job": "Senior Software Engineer",
  "salary": 120000
  }
]
```

## Requirements

- Node.js 20+
- TypeScript, ts-node, faker v5.5.3

## Install dependencies

```bash
npm install faker@5.5.3 @types/node ts-node typescript
```

## Notes

- Address and phone types are unique per person
- Output file is overwritten each run
- All fields are randomly generated for demo/testing
