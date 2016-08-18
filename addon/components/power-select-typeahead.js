import Ember from 'ember';
import layout from '../templates/components/power-select-typeahead';
const { computed } = Ember;

export default Ember.Component.extend({
  layout: layout,
  tabindex: -1,
  triggerComponent: 'power-select-typeahead/trigger',
  searchEnabled: false,
  loadingMessage: false,

  // CPs
  concatenatedTriggerClasses: computed('triggerClass', function() {
    const classes = ['ember-power-select-typeahead-trigger'];
    const passedClass = this.get('triggerClass');
    if (passedClass) {
      classes.push(passedClass);
    }
    return classes.join(' ');
  }),

  concatenatedDropdownClasses: computed('dropdownClass', function() {
    const classes = ['ember-power-select-typeahead-dropdown'];
    const passedClass = this.get('dropdownClass');
    if (passedClass) {
      classes.push(passedClass);
    }
    return classes.join(' ');
  })
});
