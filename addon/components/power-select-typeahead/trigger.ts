import Component from '@glimmer/component';
import {isBlank} from '@ember/utils';
import {run} from '@ember/runloop';
import {action, get} from '@ember/object'
import {Select} from 'ember-power-select/components/power-select';
import {tracked} from '@glimmer/tracking';

interface Extra {
  labelPath?: string;
}

// https://github.com/cibernox/ember-power-select/blob/d30e5fdd5dd8657c723bd73fe0e042cbf8a31b43/addon/templates/components/power-select.hbs#L49-L67
// https://github.com/cibernox/ember-power-select/blob/d30e5fdd5dd8657c723bd73fe0e042cbf8a31b43/addon/components/power-select.ts#L268-L286
// https://github.com/cibernox/ember-power-select/blob/d30e5fdd5dd8657c723bd73fe0e042cbf8a31b43/addon/components/power-select.ts#L227-L247
export interface PowerSelectTypeaheadTriggerArgs {
  loadingMessage?: string;
  select: Select;
  onFocus?: (evt: FocusEvent) => void;
  onBlur?: (evt: FocusEvent) => void;
  extra?: Extra;
  onInput?: (evt: InputEvent) => void;
  onKeydown?: (evt: KeyboardEvent) => boolean | void;
  placeholder?: string;
}

export default class Trigger extends Component<PowerSelectTypeaheadTriggerArgs> {

  @tracked text = '';
  private oldSelect: Select;

  constructor(owner: unknown, args: PowerSelectTypeaheadTriggerArgs) {
    super(owner, args);

    this.oldSelect = args.select;
  }

  /**
   * Lifecycle Hook
   *
   * power-select updates the state of the publicAPI (select) for every typeahead
   * so we capture this as `state` via oldSelect && newSelect
   */
  @action
  updatePublicApi(_elem: HTMLInputElement, [select, extra]: [Select, Extra | undefined]): void {
    const oldSelect = this.oldSelect;
    this.oldSelect = select;
    const newSelect = select;

    /*
     * We need to update the input field with value of the selected option whenever we're closing
     * the select box.
     */
    if (oldSelect.isOpen && !newSelect.isOpen && newSelect.searchText) {
      const inputElem = document.querySelector<HTMLInputElement>(`#ember-power-select-typeahead-input-${newSelect.uniqueId}`);
      const newText = getSelectedAsText(newSelect, extra);
      if (inputElem !== null && inputElem.value !== newText) {
        inputElem.value = newText;
      }
      this.text = newText;
    }

    if (newSelect.lastSearchedText !== oldSelect.lastSearchedText) {
      if (isBlank(newSelect.lastSearchedText)) {
        run.schedule('actions', null, newSelect.actions.close, null, true);
      } else {
        run.schedule('actions', null, newSelect.actions.open);
      }
    }

    if (oldSelect.selected !== newSelect.selected) {
      this.text = getSelectedAsText(newSelect, extra);
    }
  }

  /**
   * on mousedown prevent propagation of event
   */
  @action
  stopPropagation(evt: Event): boolean | void {
    evt.stopPropagation();
  }

  /**
   * called from power-select internals
   */
  @action
  handleKeydown(evt: KeyboardEvent): boolean | void {
    // up or down arrow and if not open, no-op and prevent parent handlers from being notified
    if ((evt.keyCode === 38 /* Arrow Up */ || evt.keyCode === 40 /* Arrow Down */) && !this.args.select.isOpen) {
      evt.stopPropagation();
      return;
    }

    const isLetter = evt.keyCode >= 48 && evt.keyCode <= 90 /* Keys 0-9 and a-z */ || evt.keyCode === 32 /* Space */;
    // if isLetter, escape or enter, prevent parent handlers from being notified
    if (isLetter || evt.keyCode === 13 /* Escape */ || evt.keyCode === 27 /* Enter */) {
      // open if loading msg configured
      if (!this.args.select.isOpen && this.args.loadingMessage) {
        run.schedule('actions', null, this.args.select.actions.open);
      }
      evt.stopPropagation();
    }

    // optional, passed from power-select
    if (this.args.onKeydown && this.args.onKeydown(evt) === false) {
      return false;
    }
    return;
  }
}

/**
 * obtains seleted value based on complex object or primitive value from power-select publicAPI
 */
function getSelectedAsText(select: Select, extra: Extra | undefined): string {
  const labelPath = extra?.labelPath;

  let value;
  if (labelPath != null && select.selected) {
    // complex object
    value = get(select.selected, labelPath);
  } else {
    // primitive value
    value = select.selected;
  }

  if (value === undefined) {
    value = '';
  }
  return value;
}

