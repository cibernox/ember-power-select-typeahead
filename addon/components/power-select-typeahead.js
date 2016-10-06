import Ember from 'ember';
import layout from '../templates/components/power-select-typeahead';
const { computed } = Ember;

function handleTouchEvent(e) {
  e.stopPropagation();
}

export default Ember.Component.extend({
  layout: layout,
  tabindex: -1,
  triggerComponent: 'power-select-typeahead/trigger',
  beforeOptionsComponent: null,
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
  }),

  didInsertElement() {
    this._super(...arguments);

    let input = this.$('.ember-power-select-typeahead-input').get(0);
    input.addEventListener('touchstart', handleTouchEvent, false);
    input.addEventListener('touchend', handleTouchEvent, false);
  },

  willDestroyElement() {
    this._super(...arguments);

    let input = this.$('.ember-power-select-typeahead-input').get(0);
    input.removeEventListener('touchstart', handleTouchEvent, false);
    input.removeEventListener('touchend', handleTouchEvent, false);
  }
});
