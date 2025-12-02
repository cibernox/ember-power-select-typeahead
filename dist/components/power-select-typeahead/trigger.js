import { addObserver, removeObserver } from '@ember/object/observers';
import { get, set, action } from '@ember/object';
import Component from '@glimmer/component';
import { schedule } from '@ember/runloop';
import { isBlank } from '@ember/utils';
import { precompileTemplate } from '@ember/template-compilation';
import { n } from 'decorator-transforms/runtime';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("{{! template-lint-disable no-pointer-down-event-binding }}\n<input type=\"search\"\n  value={{this.text}}\n  id=\"ember-power-select-typeahead-input-{{@select.uniqueId}}\"\n  class=\"ember-power-select-typeahead-input ember-power-select-search-input\"\n  autocomplete=\"off\"\n  autocorrect=\"off\"\n  autocapitalize=\"off\"\n  spellcheck=\"false\"\n  placeholder={{@placeholder}}\n  oninput={{@onInput}}\n  onfocus={{@onFocus}}\n  onblur={{@onBlur}}\n  disabled={{@select.disabled}}\n  onkeydown={{this.handleKeydown}}\n  onmousedown={{this.stopPropagation}}>\n{{#if @select.loading}}\n  <span class=\"ember-power-select-typeahead-loading-indicator\"></span>\n{{/if}}\n");

/* eslint-disable ember/no-get, ember/no-observers */
class PowerSelectTypeaheadTrigger extends Component {
  text = '';
  constructor() {
    super(...arguments);
    addObserver(this, 'args.select', this, 'onUpdatedAttrs');
    this.onUpdatedAttrs();
  }
  willDestroy() {
    super.willDestroy(...arguments);
    removeObserver(this, 'args.select', this, 'onUpdatedAttrs');
  }

  /**
   * Pseudo-Lifecycle Hook
   * power-select updates the state of the publicAPI (select) for every typeahead
   * so we capture this as `state` via oldSelect && newSelect
   *
   * @private
   * @method onUpdatedAttrs
   */
  onUpdatedAttrs() {
    let oldSelect = this.oldSelect;
    let newSelect = this.oldSelect = get(this, 'args.select');
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
      set(this, 'text', newText);
    }
    if (newSelect.lastSearchedText !== oldSelect.lastSearchedText) {
      if (isBlank(newSelect.lastSearchedText)) {
        schedule('actions', null, newSelect.actions.close, null, true);
      } else {
        schedule('actions', null, newSelect.actions.open);
      }
    }
    if (oldSelect.selected !== newSelect.selected) {
      set(this, 'text', this.getSelectedAsText());
    }
  }

  /**
   * on mousedown prevent propagation of event
   *
   * @private
   * @method stopPropagation
   * @param {Object} event
   */
  static {
    n(this.prototype, "onUpdatedAttrs", [action]);
  }
  stopPropagation(e) {
    e.stopPropagation();
  }

  /**
   * called from power-select internals
   *
   * @private
   * @method handleKeydown
   * @param {Object} event
   */
  static {
    n(this.prototype, "stopPropagation", [action]);
  }
  handleKeydown(e) {
    // up or down arrow and if not open, no-op and prevent parent handlers from being notified
    if ([38, 40].includes(e.keyCode) && !get(this, 'args.select.isOpen')) {
      e.stopPropagation();
      return;
    }
    let isLetter = e.keyCode >= 48 && e.keyCode <= 90 || e.keyCode === 32; // Keys 0-9, a-z or SPACE
    // if isLetter, escape or enter, prevent parent handlers from being notified
    if (isLetter || [13, 27].includes(e.keyCode)) {
      let select = get(this, 'args.select');
      // open if loading msg configured
      if (!select.isOpen && get(this, 'args.loadingMessage')) {
        schedule('actions', null, select.actions.open);
      }
      e.stopPropagation();
    }

    // optional, passed from power-select
    let onkeydown = get(this, 'args.onKeydown');
    if (onkeydown && onkeydown(e) === false) {
      return false;
    }
  }

  /**
   * obtains seleted value based on complex object or primitive value from power-select publicAPI
   *
   * @private
   * @method getSelectedAsText
   */
  static {
    n(this.prototype, "handleKeydown", [action]);
  }
  getSelectedAsText() {
    let path = get(this, 'args.extra.labelPath');
    let value = get(this, `args.select.selected${path ? `.${path}` : ''}`);
    return value === undefined ? '' : value;
  }
}
setComponentTemplate(TEMPLATE, PowerSelectTypeaheadTrigger);

export { PowerSelectTypeaheadTrigger as default };
//# sourceMappingURL=trigger.js.map
