import Ember from 'ember';
import layout from '../../templates/components/power-select-typeahead/selected';

const { get, run, isBlank } = Ember;

export default Ember.Component.extend({
  layout: layout,
  tagName: '',

  // Lifecycle hooks
  didReceiveAttrs({ oldAttrs, newAttrs }) {
    this._super(...arguments);
    if (oldAttrs === undefined) { return; } // First time nothing to do
    let { isOpen, actions: { open, close } } = newAttrs.select;

    if (isOpen && !isBlank(oldAttrs.searchText) && isBlank(newAttrs.searchText)) {
      return run.schedule('actions', close);
    }

    if (!isOpen) {
      // is closed but a promise was just resolved and the search text is not empty
      if (oldAttrs.hasPendingPromises && !newAttrs.hasPendingPromises && newAttrs.options && !isBlank(newAttrs.searchText)) {
        return run.schedule('actions', open);
      }
    } else if (oldAttrs.options && get(oldAttrs.options, 'length') === 0 && !oldAttrs.hasPendingPromises && newAttrs.hasPendingPromises) {
      // Options were empty (the "No matches" message was shown) and a new search starts, so the box must close
      run.schedule('actions', close);
    }
  },

  // Actions
  actions: {
    captureClick(e) {
      e.stopPropagation();
    },

    search(term, e) {
      this.get('select.actions.search')(term, e);
    },

    handleKeydown(e) {
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
  }
});
