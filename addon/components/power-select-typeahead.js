import Ember from 'ember';
import EmberPowerSelect from 'ember-power-select/components/power-select';

export default EmberPowerSelect.extend({
  tabindex: -1,
  classNames: ['ember-power-select-typeahead'],
  triggerComponent: 'power-select-typeahead/trigger',
  beforeOptionsComponent: null,
  searchEnabled: false,
  loadingMessage: false,
  showOptions: false,
  noMatchesMessage: false,
  actions: {
    onFocus(e) {
      if (this.get('showOptions')) {
        this.publicAPI.actions.open(e);
      }
    },
    onInput(e) {
      let term = e.target.value;
      let action = this.get('oninput');
      let isOpen = Ember.get(this.publicAPI, 'isOpen');
      if (action && action(term, this.publicAPI, e) === false) {
        if (isOpen) { this.publicAPI.actions.close(e); }
        return;
      }
      this._super(...arguments);
      let hasValue = term.length;
      let hasOptions = this.get('showOptions');
      let shouldShow = (hasValue || hasOptions);
      if (shouldShow && !isOpen) { this.publicAPI.actions.open(e); }
      if (!shouldShow && isOpen) { this.publicAPI.actions.close(e); }
    },
    deactivate(e) {
      this.publicAPI.actions.close(e);
    }
  }
});
