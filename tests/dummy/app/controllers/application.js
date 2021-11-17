import Controller from '@ember/controller';
import RSVP from 'rsvp';
import { later } from '@ember/runloop';

const numbers = [
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

const users = [
  { name: 'Arthur' },
  { name: 'Sam' },
  { name: 'Dan' },
  { name: 'Miguel' },
  { name: 'Svilen' },
  { name: 'Ruslan' },
  { name: 'Kirill' },
  { name: 'Stuart' },
  { name: 'Jamie' },
  { name: 'Matteo' }
];
const extra = { labelPath: 'name' };

export default Controller.extend({
  numbers,
  users,
  extra,

  actions: {
    skipShortSearches(term, select) {
      if (term.length <= 2) {
        select.actions.search('');
        return false;
      }
    },

    search(term) {
      return numbers.filter((num) => num.indexOf(term) > -1);
    },

    searchAsync(term) {
      return new RSVP.Promise(function(resolve) {
        if (term.length === 0) {
          resolve([]);
        } else {
          later(function() {
            resolve(numbers.filter((num) => num.indexOf(term) > -1));
          }, 600);
        }
      });
    },

    searchUsersAsync(term) {
      // return users.filter(u => u.name.indexOf(term) > -1);
      return new RSVP.Promise(function(resolve) {
        if (term.length === 0) {
          resolve([]);
        } else {
          later(function() {
            resolve(users.filter((u) => u.name.indexOf(term) > -1));
          }, 600);
        }
      });
    }
  }
});
