import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import $ from 'jquery';
import { numbers, countries } from '../constants';
import { typeInSearch, nativeMouseUp } from '../../helpers/ember-power-select';

moduleForComponent('power-select-typeahead', 'Integration | Component | power select typeahead', {
  integration: true
});

test('It can select options when options are strings', function(assert) {
  assert.expect(4);
  this.numbers = numbers;
  this.render(hbs`
    {{#power-select-typeahead options=numbers selected=selected onchange=(action (mut selected)) as |number|}}
      {{number}}
    {{/power-select-typeahead}}
  `);
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The component is closed');
  typeInSearch('tw');
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The component is opened');
  nativeMouseUp('.ember-power-select-option:eq(1)');
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The component is closed again');
  assert.equal(this.$('.ember-power-select-search-input').val(), 'twelve', 'The input contains the selected option');
});

test('It can select options when options are objects', function(assert) {
  assert.expect(4);
  this.countries = countries;
  this.render(hbs`
    {{#power-select-typeahead options=countries selected=selected onchange=(action (mut selected)) searchField="name" extra=(hash labelPath="name") as |country|}}
      {{country.name}}
    {{/power-select-typeahead}}
  `);
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The component is closed');
  typeInSearch('tat');
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The component is opened');
  nativeMouseUp('.ember-power-select-option:eq(0)');
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The component is closed again');
  assert.equal(this.$('.ember-power-select-search-input').val(), 'United States', 'The input contains the selected option');
});

test('Removing a few characters and selecting the same option that is already selected updates the text of the input', function(assert) {
  assert.expect(5);
  this.countries = countries;
  this.selected = countries[2];
  this.render(hbs`
    {{#power-select-typeahead options=countries selected=selected onchange=(action (mut selected)) searchField="name" extra=(hash labelPath="name") as |country|}}
      {{country.name}}
    {{/power-select-typeahead}}
  `);
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The component is closed');
  typeInSearch('Port');
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The component is opened');
  assert.equal(this.$('.ember-power-select-search-input').val(), 'Port', 'The input contains the selected option');
  nativeMouseUp('.ember-power-select-option:eq(0)');
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The component is closed again');
  assert.equal(this.$('.ember-power-select-search-input').val(), 'Portugal', 'The input contains the selected option');
});