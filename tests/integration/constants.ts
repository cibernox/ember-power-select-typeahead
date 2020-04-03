export const STRING_NUMBERS = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
  'twenty'
];

export const NAMES = [
  'María',
  'Søren Larsen',
  'João',
  'Miguel',
  'Marta',
  'Lisa'
];

export interface Country {
  name: string;
  code: string;
  population: number;
}

export const COUNTRIES: Country[] = [
  {name: 'United States', code: 'US', population: 321853000},
  {name: 'Spain', code: 'ES', population: 46439864},
  {name: 'Portugal', code: 'PT', population: 10374822},
  {name: 'Russia', code: 'RU', population: 146588880},
  {name: 'Latvia', code: 'LV', population: 1978300},
  {name: 'Brazil', code: 'BR', population: 204921000},
  {name: 'United Kingdom', code: 'GB', population: 64596752}
];
