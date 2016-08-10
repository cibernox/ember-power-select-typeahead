import Ember from 'ember';
import layout from '../../templates/components/power-select-typeahead/trigger';

const { computed } = Ember;

export default Ember.Component.extend({
  layout: layout,
  tagName: '',
  _value: '',
  // CPs
  text: computed('select.selected', 'extra.labelPath', function() {
    let labelPath = this.get('extra.labelPath');
    let selectedText = this.get('select.selected');
    if (labelPath) {
      selectedText = this.get('select.selected.' + labelPath);
    }
    return selectedText || this.get('_value');
  }),

  // Actions
  actions: {
    stopPropagation(e) {
      // don't allow the click-to-toggle functionality
      e.stopPropagation();
    },

    handleKeydown(e) {
      let isLetter = e.keyCode >= 48 && e.keyCode <= 90 || e.keyCode === 32; // Keys 0-9, a-z or SPACE
      let isSpecialKeyWhileClosed = !isLetter && !this.get('select.isOpen') && [13, 27, 38, 40].indexOf(e.keyCode) > -1; // Enter, Escape, Up, Down
      if (isLetter || isSpecialKeyWhileClosed) {
        e.stopPropagation();
      }
    },

    handleInputLocal(e) {
      this.set('_value', e.target.value);
      if (this.get('select.selected')) {
        // reset the value whenever we change the input
        this.getAttr('select').actions.select(null);
      }
      this.sendAction('onInput', e);
    },
    onFocus(e) {
      this.sendAction('onFocus', e);
    },
    onBlur(e) {
      this.sendAction('deactivate', e);
    }
  }
});
