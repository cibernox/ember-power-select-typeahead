import Ember from 'ember';
import layout from '../../templates/components/power-select-typeahead/trigger';

const { Component, isBlank, run, computed } = Ember;

export default Component.extend({
  layout,
  tagName: '',

  // CPs
  text: computed('select.selected', 'extra.labelPath', {
    get() {
      return this.getSelectedAsText();
    },
    set(_, v) {
      return v;
    }
  }),

  // Lifecycle hooks
  didReceiveAttrs() {
    this._super(...arguments);
    let oldSelect = this.get('oldSelect');
    let newSelect = this.set('oldSelect', this.get('select'));
    let keepOpenOnLoad = this.get('extra.keepOpenOnLoad');
    if (!oldSelect) {
      return;
    }
    /*
     * We need to update the input field with value of the selected option whenever we're closing
     * the select box. But we also close the select box when we're loading search results (unless
     * keepOpenOnLoad is set) and when we remove input text -- so protect against this
     */
    if (oldSelect.isOpen && !newSelect.isOpen && !newSelect.loading && newSelect.searchText) {
      let input = document.querySelector(`#ember-power-select-typeahead-input-${newSelect.uniqueId}`);
      let newText = this.getSelectedAsText();
      if (input.value !== newText) {
        input.value = newText;
      }
      this.set('text', newText);
    }

    if (newSelect.lastSearchedText !== oldSelect.lastSearchedText) {
      if (isBlank(newSelect.lastSearchedText)) {
        run.schedule('actions', null, newSelect.actions.close, null, true);
      } else {
        run.schedule('actions', null, newSelect.actions.open);
      }
    } else if (!keepOpenOnLoad && !isBlank(newSelect.lastSearchedText) && newSelect.options.length === 0 && newSelect.loading) {
      run.schedule('actions', null, newSelect.actions.close, null, true);
    } else if (oldSelect.loading && !newSelect.loading && newSelect.options.length > 0) {
      run.schedule('actions', null, newSelect.actions.open);
    }
  },

  // Actions
  actions: {
    stopPropagation(e) {
      e.stopPropagation();
    },

    handleKeydown(e) {
      if ([38, 40].indexOf(e.keyCode) > -1 && !this.get('select.isOpen')) {
        e.stopPropagation();
        return;
      }
      let isLetter = e.keyCode >= 48 && e.keyCode <= 90 || e.keyCode === 32; // Keys 0-9, a-z or SPACE
      if (isLetter || [13, 27].indexOf(e.keyCode) > -1) {
        e.stopPropagation();
      }

      let onkeydown = this.get('onKeydown');
      if (onkeydown && onkeydown(e) === false) {
        return false;
      }
    },

    handleInputLocal(e) {
      this.get('onInput')(e);
      this.set('text', e.target.value);
    }
  },

  // Methods
  getSelectedAsText() {
    let labelPath = this.get('extra.labelPath');
    let value;
    if (labelPath) {
      value = this.get(`select.selected.${labelPath}`);
    } else {
      value = this.get('select.selected');
    }
    if (value === undefined) {
      value = '';
    }
    return value;
  }
});
