import Ember from 'ember';
import layout from '../../templates/components/power-select-typeahead/trigger';

const { isBlank, run, get } = Ember;

export default Ember.Component.extend({
  layout: layout,
  tagName: '',

  // Lifecycle hooks
  didUpdateAttrs({ oldAttrs, newAttrs }) {
    this._super(...arguments);
    if (newAttrs.lastSearchedText !== oldAttrs.lastSearchedText) {
      if (isBlank(newAttrs.lastSearchedText)) {
        run.schedule('actions', null, newAttrs.select.actions.close, null, true);
      } else {
        run.schedule('actions', null, newAttrs.select.actions.open)
      }
    } else if (!isBlank(newAttrs.lastSearchedText) && get(this, 'options.length') === 0 && this.get('loading')) {
      run.schedule('actions', null, newAttrs.select.actions.close, null, true);
    }
  },

  // Actions
  actions: {
    stopPropagation(e) {
      e.stopPropagation();
    },

    handleKeydown(e) {
      let isLetter = e.keyCode >= 48 && e.keyCode <= 90 || e.keyCode === 32; // Keys 0-9, a-z or SPACE
      let isSpecialKeyWhileClosed = !isLetter && !this.get('select.isOpen') && [13, 27, 38, 40].indexOf(e.keyCode) > -1;
      if (isLetter || isSpecialKeyWhileClosed) {
        e.stopPropagation();
      }
    }
  }
});
