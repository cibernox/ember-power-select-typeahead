import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { numbers, countries } from '../constants';
import { typeInSearch } from '../../helpers/ember-power-select';
import { click, find, findAll } from 'ember-native-dom-helpers';

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
  assert.notOk(find('.ember-power-select-dropdown'), 'The component is closed');
  typeInSearch('tw');
  assert.ok(find('.ember-power-select-dropdown'), 'The component is opened');
  click(findAll('.ember-power-select-option')[1]);
  assert.notOk(find('.ember-power-select-dropdown'), 'The component is closed again');
  assert.equal(find('.ember-power-select-search-input').value, 'twelve', 'The input contains the selected option');
});

test('It can select options when options are objects', function(assert) {
  assert.expect(4);
  this.countries = countries;
  this.render(hbs`
    {{#power-select-typeahead options=countries selected=selected onchange=(action (mut selected)) searchField="name" extra=(hash labelPath="name") as |country|}}
      {{country.name}}
    {{/power-select-typeahead}}
  `);
  assert.notOk(find('.ember-power-select-dropdown'), 'The component is closed');
  typeInSearch('tat');
  assert.ok(find('.ember-power-select-dropdown'), 'The component is opened');
  click(findAll('.ember-power-select-option')[0]);
  assert.notOk(find('.ember-power-select-dropdown'), 'The component is closed again');
  assert.equal(find('.ember-power-select-search-input').value, 'United States', 'The input contains the selected option');
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
  assert.notOk(find('.ember-power-select-dropdown'), 'The component is closed');
  typeInSearch('Port');
  assert.ok(find('.ember-power-select-dropdown'), 'The component is opened');
  assert.equal(find('.ember-power-select-search-input').value, 'Port', 'The input contains the selected option');
  click(findAll('.ember-power-select-option')[0]);
  assert.notOk(find('.ember-power-select-dropdown'), 'The component is closed again');
  assert.equal(find('.ember-power-select-search-input').value, 'Portugal', 'The input contains the selected option');
});
