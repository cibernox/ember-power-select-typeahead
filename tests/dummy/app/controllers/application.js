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


export default Ember.Controller.extend({
  numbers: numbers,

  actions: {
    search(term) {
      return numbers.filter(num => num.indexOf(term) > -1);
    },

    searchAsync(term) {
      return new Ember.RSVP.Promise(function(resolve) {
        if (term.length === 0) {
          resolve([]);
          return;
        }
        Ember.run.later(function() {
          resolve(numbers.filter(num => num.indexOf(term) > -1));
        }, 1000);
      });
    }
  }
});