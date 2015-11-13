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
  'ten'
];

export default Ember.Controller.extend({
  numbers: numbers,

  actions: {
    search(term) {
      return numbers.filter(num => num.indexOf(term) > -1);
    }
  }
});