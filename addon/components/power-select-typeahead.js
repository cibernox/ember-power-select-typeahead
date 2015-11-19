import Ember from 'ember';
import layout from '../templates/components/power-select-typeahead';
import { defaultOptions } from 'ember-power-select/components/power-select';

export default Ember.Component.extend(defaultOptions, {
  layout: layout,
  tabindex: -1,
  selectedComponent: 'power-select-typeahead/selected',
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
