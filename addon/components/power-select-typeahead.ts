import Component from '@glimmer/component';
import {action} from '@ember/object';
import {Select} from 'ember-power-select/addon/components/power-select';
import {MatcherFn} from 'ember-power-select/addon/utils/group-utils';
import {CalculatePosition} from 'ember-basic-dropdown/utils/calculate-position';

interface PromiseProxy<T> extends Promise<T> {
  content: any;
}

// https://ember-power-select.com/docs/api-reference
export interface PowerSelectTypeaheadArgs<T> {
  afterOptionsComponent?: string;
  allowClear?: boolean;
  animationEnabled?: boolean;
  ariaDescribedBy?: string;
  ariaInvalid?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  beforeOptionsComponent?: string;
  buildSelection?: (selected: T, select: Select) => T;
  closeOnSelect?: boolean;
  defaultHighlighted?: T;
  destination?: string;
  disabled?: boolean;
  dropdownClass?: string;
  extra?: {};
  horizontalPosition?: 'left' | 'center' | 'right';
  initiallyOpened?: boolean;
  loadingMessage?: string;
  matcher?: MatcherFn;
  matchTriggerWidth?: boolean;
  noMatchesMessage?: string;
  onBlur?: (select: Select, evt: FocusEvent) => void;
  onChange?: (selection: T, select: Select, evt?: Event) => void;
  onClose?: (select: Select, evt: Event) => boolean | void;
  onFocus?: (select: Select, evt: FocusEvent) => void;
  onInput?: (term: string, select: Select, evt: InputEvent) => string | false | void;
  onKeydown?: (select: Select, evt: KeyboardEvent) => boolean | void;
  onOpen?: (select: Select, evt: Event) => boolean | void;
  options: T[] | PromiseProxy<T[]>;
  optionsComponent?: string;
  placeholder?: string;
  preventScroll?: boolean;
  registerAPI?: (select: Select) => void;
  renderInPlace?: boolean;
  search?: (term: string, select: Select) => T[] | PromiseProxy<T[]>;
  searchEnabled?: boolean;
  searchField?: string;
  searchMessage?: string;
  searchPlaceholder?: string;
  selected: T | PromiseProxy<T>;
  selectedItemComponent?: string;
  tabindex?: number; // default -1
  triggerClass?: string;
  triggerComponent?: string;
  triggerId?: string;
  verticalPosition?: 'auto' | 'above' | 'below';
  calculatePosition?: CalculatePosition;
}

export default class PowerSelectTypeahead extends Component<PowerSelectTypeaheadArgs<any>> {

  get beforeOptionsComponent(): string | null {
    return this.args.beforeOptionsComponent ?? null;
  }

  get loadingMessage(): string | null {
    return this.args.loadingMessage ?? null;
  }

  get noMatchesMessage(): string | null {
    return this.args.noMatchesMessage ?? null;
  }

  get tabindex(): number {
    return this.args.tabindex ?? -1;
  }

  get triggerComponent(): string {
    return this.args.triggerComponent ?? 'power-select-typeahead/trigger';
  }

  @action
  onKeyDown(select: Select, evt: KeyboardEvent): boolean | void {
    // if user passes `onKeydown` action
    if (this.args.onKeydown && this.args.onKeydown(select, evt) === false) {
      return false;
    }

    // if escape, then clear out selection
    if (evt.keyCode === 27) {
      select.actions.choose(null);
    }

    return;
  }
}
