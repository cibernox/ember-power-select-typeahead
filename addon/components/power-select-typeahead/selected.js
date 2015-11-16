import Ember from 'ember';
import layout from '../../templates/components/power-select-typeahead/selected';

export default Ember.Component.extend({
  layout: layout,
  tagName: '',

  // Actions
  actions: {
    captureClick(e) {
      e.stopPropagation();
    },

    search(e) {
      let term = e.target.value;
      this.get('search')(term, e);
      e.stopPropagation();
      if (term.length > 0) {
        this.get('dropdown').open(e);
      } else {
        this.get('dropdown').close(e, true);
      }
    },

    handleKeydown(e) {
      let dropdown = this.get('dropdown');
      if (!dropdown.isOpen) {
        e.stopPropagation();
        return;
      }
      let term = e.target.value;
      if (e.keyCode === 9) {
        this.get('select')(this.get('highlighted'), dropdown, e);
      }
      if (term.length === 0) {
        e.stopPropagation();
      }
    }
  }
});
