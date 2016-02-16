import Ember from 'ember';
import layout from '../../templates/components/power-select-typeahead/trigger';

const { isBlank } = Ember;

export default Ember.Component.extend({
  layout: layout,
  tagName: '',

  didUpdateAttrs({ oldAttrs, newAttrs }) {
    this._super(...arguments);
    if (newAttrs.lastSearchedText !== oldAttrs.lastSearchedText) {
      newAttrs.select.actions[isBlank(newAttrs.lastSearchedText) ? 'close' : 'open']();
    }
  },

  // Actions
  actions: {
    captureMouseDown(e) {
      e.stopPropagation();
    },

    search(term, e) {
      this.get('select.actions.search')(term, e);
    },

    handleKeydown(e) {
      let select = this.get('select');
      if (!select.isOpen) {
        e.stopPropagation();
      }
    }
  }
});
