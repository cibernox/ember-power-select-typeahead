import Ember from 'ember';

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

export default Ember.Controller.extend({
  numbers: numbers,
  users: users,
  extra: { labelPath: 'name' },

  actions: {
    search(term) {
      return numbers.filter(num => num.indexOf(term) > -1);
    },

    searchAsync(term) {
      return new Ember.RSVP.Promise(function(resolve) {
        if (term.length === 0) {
          resolve([]);
        } else {
          Ember.run.later(function() {
            resolve(numbers.filter(num => num.indexOf(term) > -1));
          }, 600);
        }
      });
    },

    searchUsersAsync(term) {
      console.debug('searchUsersAsync ' + term);
      // return users.filter(u => u.name.indexOf(term) > -1);
      return new Ember.RSVP.Promise(function(resolve) {
        if (term.length === 0) {
          resolve([]);
        } else {
          Ember.run.later(function() {
            console.debug('resolve with ', users.filter(u => u.name.indexOf(term) > -1));
            resolve(users.filter(u => u.name.indexOf(term) > -1));
          }, 600);
        }
      });
    }
  }
});