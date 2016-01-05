import Ember from 'ember';
import layout from '../../templates/components/power-select-typeahead/selected';

const { get, run, isBlank } = Ember;

export default Ember.Component.extend({
  layout: layout,
  tagName: 'input',

  classNames: 'ember-power-select-typeahead-input',

  // Observers
  optionsObserver: Ember.observer('options.length', function() {
    if (this.get('options.length') > 0 && this.get('select.isOpen') === false) {
      this.get('select.actions.open');
    } else if (this.get('searchText.length') === 0 && this.get('select.isOpen') === true) {
      this.get('select.actions.close');
    }
  }),

  // Computed Properties
  inputAction: Ember.computed('select.isOpen', function() {
    if (this.get('select.isOpen')) {
      return 'focus';
    } else {
      return 'blur';
    }
  }),

  // Events
  click(e) {
    this.$()[this.get('inputAction')]();
    e.stopPropagation();
  },

  input(e) {
    this.get('select.actions.search')(e.target.value);
  },

  keyDown(e) {
    let select = this.get('select');
    if (!select.isOpen) {
      e.stopPropagation();
      return;
    }
    let term = e.target.value;
    if (e.keyCode === 9) {
      select.actions.select(this.get('highlighted'), e);
    }
    if (term.length === 0) {
      e.stopPropagation();
    }
  }
});
