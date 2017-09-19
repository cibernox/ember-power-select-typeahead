import Ember from 'ember';
const { RSVP, run } = Ember;
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { numbers, countries } from '../constants';
import { typeInSearch, triggerKeydown } from '../../helpers/ember-power-select';
import { click, find, findAll } from 'ember-native-dom-helpers';
import wait from 'ember-test-helpers/wait';

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

test('can search async with loading message', function(assert) {
  assert.expect(6);
  this.searchCountriesAsync = () => {
    return new RSVP.Promise((resolve) => {
      run.later(() => {
        resolve(countries);
      }, 100);
    });
  };
  this.loadingMessage = 'searching...';
  this.render(hbs`
    {{#power-select-typeahead 
      search=searchCountriesAsync
      selected=selected 
      loadingMessage=loadingMessage
      onchange=(action (mut selected)) 
      extra=(hash labelPath="name") as |country|}}
      {{country.name}}
    {{/power-select-typeahead}}
  `);
  typeInSearch('Uni');
  triggerKeydown('.ember-power-select-search-input', 85);
  assert.equal(find('.ember-power-select-option--loading-message').textContent.trim(), 'searching...', 'The loading message shows');
  assert.notOk(find('.ember-power-select-dropdown'), 'The component closed while searching');
  return wait().then(() => {
    assert.ok(find('.ember-power-select-dropdown'), 'The component is opened');
    assert.equal(find('.ember-power-select-search-input').value, 'Uni', 'The input contains the selected option');
    click(findAll('.ember-power-select-option')[0]);
    assert.notOk(find('.ember-power-select-dropdown'), 'The component is closed again');
    assert.equal(find('.ember-power-select-search-input').value, 'United States', 'The input contains the selected option');
  });
});

test('can search async with no loading message', function(assert) {
  assert.expect(2);
  this.searchCountriesAsync = () => {
    return new RSVP.Promise((resolve) => {
      run.later(() => {
        resolve(countries);
      }, 100);
    });
  };
  this.render(hbs`
    {{#power-select-typeahead 
      search=searchCountriesAsync
      selected=selected 
      onchange=(action (mut selected)) 
      extra=(hash labelPath="name") as |country|}}
      {{country.name}}
    {{/power-select-typeahead}}
  `);
  typeInSearch('Uni');
  triggerKeydown('.ember-power-select-search-input', 85);
  assert.notOk(find('.ember-power-select-option--loading-message'), 'No loading message if not configured');
  assert.notOk(find('.ember-power-select-dropdown'), 'The component is closed while searching');
});

test('can search async with noMatchesMessage', function(assert) {
  assert.expect(3);
  this.searchCountriesAsync = () => {
    return new RSVP.Promise((resolve) => {
      run.later(() => {
        resolve([]);
      }, 100);
    });
  };
  this.noMatchesMessage = 'no matches homie';
  this.render(hbs`
    {{#power-select-typeahead 
      search=searchCountriesAsync
      selected=selected 
      noMatchesMessage=noMatchesMessage
      onchange=(action (mut selected)) 
      extra=(hash labelPath="name") as |country|}}
      {{country.name}}
    {{/power-select-typeahead}}
  `);
  typeInSearch('Uniwatttt');
  triggerKeydown('.ember-power-select-search-input', 85);
  assert.notOk(find('.ember-power-select-dropdown'), 'The component is closed while searching');
  return wait().then(() => {
    assert.equal(find('.ember-power-select-option--no-matches-message').textContent.trim(), 'no matches homie');
    assert.ok(find('.ember-power-select-dropdown'), 'The component is opened');
  });
});

test('search async with no text will open and then close dropdown', function(assert) {
  assert.expect(2);
  this.searchCountriesAsync = () => {
    return new RSVP.Promise((resolve) => {
      resolve(countries);
    });
  };
  this.render(hbs`
    {{#power-select-typeahead 
      search=searchCountriesAsync
      selected=selected 
      onchange=(action (mut selected)) 
      extra=(hash labelPath="name") as |country|}}
      {{country.name}}
    {{/power-select-typeahead}}
  `);
  typeInSearch('Uni');
  triggerKeydown('.ember-power-select-search-input', 85);
  assert.ok(find('.ember-power-select-dropdown'), 'The component is opened');
  typeInSearch('');
  assert.notOk(find('.ember-power-select-dropdown'), 'The component is closed');
});
