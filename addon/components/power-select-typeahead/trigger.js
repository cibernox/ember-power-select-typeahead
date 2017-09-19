import Ember from 'ember';
import layout from '../../templates/components/power-select-typeahead/trigger';

const { Component, isBlank, run, computed } = Ember;

export default Component.extend({
  layout,
  tagName: '',

  /**
   * value for input
   *
   * @private
   * @property text
   */
  text: computed('select.selected', 'extra.labelPath', {
    get() {
      return this.getSelectedAsText();
    },
    set(_, v) {
      return v;
    }
  }),

  /**
   * Lifecycle Hook
   * power-select updates the state of the publicAPI (select) for every typeahead
   * so we capture this as `state` via oldSelect && newSelect
   *
   * @private
   * @method didReceiveAttrs
   */
  didReceiveAttrs() {
    this._super(...arguments);
    let oldSelect = this.get('oldSelect');
    let newSelect = this.set('oldSelect', this.get('select'));
    // if no selection on init
    if (!oldSelect) {
      return;
    }
    /*
     * We need to update the input field with value of the selected option whenever we're closing
     * the select box.
     */
    if (oldSelect.isOpen && !newSelect.isOpen && newSelect.searchText) {
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
    }
  },

  actions: {
    /**
     * on mousedown prevent propagation of event
     *
     * @private
     * @method stopPropagation
     * @param {Object} event
     */
    stopPropagation(e) {
      e.stopPropagation();
    },

    /**
     * called from power-select internals
     *
     * @private
     * @method handleKeydown
     * @param {Object} event
     */
    handleKeydown(e) {
      // up or down arrow and if not open, no-op and prevent parent handlers from being notified
      if ([38, 40].indexOf(e.keyCode) > -1 && !this.get('select.isOpen')) {
        e.stopPropagation();
        return;
      }
      let isLetter = e.keyCode >= 48 && e.keyCode <= 90 || e.keyCode === 32; // Keys 0-9, a-z or SPACE
      // if isLetter, escape or enter, prevent parent handlers from being notified
      if (isLetter || [13, 27].indexOf(e.keyCode) > -1) {
        // TODO: open to show loading message on first keyup.  Otherwise dropdown.content isn't rendered yet to
        // show loading msg
        e.stopPropagation();
      }

      // optional, passed from power-select
      let onkeydown = this.get('onKeydown');
      if (onkeydown && onkeydown(e) === false) {
        return false;
      }
    }
  },

  /**
   * obtains seleted value based on complex object or primitive value from power-select publicAPI
   *
   * @private
   * @method getSelectedAsText
   */
  getSelectedAsText() {
    let labelPath = this.get('extra.labelPath');
    let value;
    if (labelPath) {
      // complex object
      value = this.get(`select.selected.${labelPath}`);
    } else {
      // primitive value
      value = this.get('select.selected');
    }
    if (value === undefined) {
      value = '';
    }
    return value;
  }
});
