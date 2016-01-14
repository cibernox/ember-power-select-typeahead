import Ember from 'ember';
import layout from '../templates/components/power-select-typeahead';

export default Ember.Component.extend({
  layout: layout,
  tabindex: -1,
  triggerComponent: 'power-select-typeahead/trigger',
  searchEnabled: false,
  loadingMessage: false,

  // CPs
  concatenatedClasses: Ember.computed('class', function() {
    const classes = ['ember-power-select-typeahead'];
    const passedClass = this.get('class');
    if (passedClass) {
      classes.push(passedClass);
    }
    return classes.join(' ');
  })
});
