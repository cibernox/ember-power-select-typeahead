import Ember from 'ember';
import layout from '../../templates/components/power-select-typeahead/trigger';

const { get } = Ember;

export default Ember.Component.extend({
  layout: layout,
  tagName: '',

  // Observers
  optionsObserver: Ember.observer('options.length', 'searchText.length', function() {
    let select = this.get('select');
    if (!this.get('searchText.length')) {
      if (select.isOpen) { select.actions.close(); }
      return;
    }
    let options = this.get('options');
    if (get(options, 'isPending')) {
      if (get(options, 'length') === 0) { select.actions.close(); }
      this._lastSearch = options;
      options.then((results) => {
        if (this._lastSearch === options && !this.get('select.isOpen')) {
          select.actions.open();
        }
      });
      return;
    }

    if (select.isOpen === false) {
      return select.actions.open();
    }
  }),

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
        return;
      }
      let term = e.target.value;
      if (e.keyCode === 9 || e.keyCode === 13) {
        select.actions.choose(this.get('highlighted'), e);
      }
      if (term.length === 0) {
        e.stopPropagation();
      }
    }
  }
});
