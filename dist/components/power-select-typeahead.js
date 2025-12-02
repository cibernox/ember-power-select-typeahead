import PowerSelectTypeaheadTrigger from './power-select-typeahead/trigger.js';
import { ensureSafeComponent } from '@embroider/util';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { precompileTemplate } from '@ember/template-compilation';
import { n } from 'decorator-transforms/runtime';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("<PowerSelect\n  @afterOptionsComponent={{@afterOptionsComponent}}\n  @allowClear={{@allowClear}}\n  @animationEnabled={{@animationEnabled}}\n  @ariaDescribedBy={{@ariaDescribedBy}}\n  @ariaInvalid={{@ariaInvalid}}\n  @ariaLabel={{@ariaLabel}}\n  @ariaLabelledBy={{@ariaLabelledBy}}\n  @beforeOptionsComponent={{this.beforeOptionsComponent}}\n  @buildSelection={{@buildSelection}}\n  @closeOnSelect={{@closeOnSelect}}\n  @defaultHighlighted={{@defaultHighlighted}}\n  @destination={{@destination}}\n  @disabled={{@disabled}}\n  @dropdownClass={{this.concatenatedDropdownClasses}}\n  @extra={{@extra}}\n  @groupComponent={{@groupComponent}}\n  @horizontalPosition={{@horizontalPosition}}\n  @initiallyOpened={{@initiallyOpened}}\n  @loadingMessage={{this.loadingMessage}}\n  @matcher={{@matcher}}\n  @matchTriggerWidth={{@matchTriggerWidth}}\n  @noMatchesMessage={{this.noMatchesMessage}}\n  @onBlur={{@onBlur}}\n  @onChange={{@onChange}}\n  @onClose={{@onClose}}\n  @onFocus={{@onFocus}}\n  @onInput={{@onInput}}\n  @onKeydown={{this.onKeyDown}}\n  @onOpen={{@onOpen}}\n  @options={{@options}}\n  @optionsComponent={{@optionsComponent}}\n  @placeholder={{@placeholder}}\n  @preventScroll={{@preventScroll}}\n  @registerAPI={{@registerAPI}}\n  @renderInPlace={{@renderInPlace}}\n  @search={{@search}}\n  @searchEnabled={{@searchEnabled}}\n  @searchField={{@searchField}}\n  @searchMessage={{@searchMessage}}\n  @searchPlaceholder={{@searchPlaceholder}}\n  @selected={{@selected}}\n  @selectedItemComponent={{@selectedItemComponent}}\n  @tabindex={{this.tabindex}}\n  @triggerClass={{this.concatenatedTriggerClasses}}\n  @triggerComponent={{this.triggerComponent}}\n  @triggerId={{@triggerId}}\n  @triggerRole={{false}}\n  @verticalPosition={{@verticalPosition}}\n  @calculatePosition={{@calculatePosition}}\n  ...attributes\n  as |option term|>\n  {{yield option term}}\n</PowerSelect>\n");

const noopKeyDown = () => {};
class PowerSelectTypeahead extends Component {
  // Args w/ defaults
  constructor() {
    super(...arguments);
    const triggerComponent = this.args.triggerComponent || PowerSelectTypeaheadTrigger;
    this.triggerComponent = ensureSafeComponent(triggerComponent);
    this.beforeOptionsComponent = this.args.beforeOptionsComponent || null;
    this.noMatchesMessage = this.args.noMatchesMessage || null;
    this.loadingMessage = this.args.loadingMessage || null;
    this.tabindex = this.args.tabindex || -1;
  }

  // CPs
  get concatenatedTriggerClasses() {
    let classes = ['ember-power-select-typeahead-trigger'];
    let passedClass = this.args.triggerClass;
    if (passedClass) {
      classes.push(passedClass);
    }
    return classes.join(' ');
  }
  get concatenatedDropdownClasses() {
    let classes = ['ember-power-select-typeahead-dropdown'];
    let passedClass = this.args.dropdownClass;
    if (passedClass) {
      classes.push(passedClass);
    }
    return classes.join(' ');
  }
  onKeyDown(select, e) {
    let action = this.args.onkeydown || noopKeyDown;

    // if user passes `onkeydown` action
    if (action && action(select, e) === false) {
      return false;
    } else {
      // if escape, then clear out selection
      if (e.keyCode === 27) {
        select.actions.choose(null);
      }
    }
  }
  static {
    n(this.prototype, "onKeyDown", [action]);
  }
}
setComponentTemplate(TEMPLATE, PowerSelectTypeahead);

export { PowerSelectTypeahead as default };
//# sourceMappingURL=power-select-typeahead.js.map
