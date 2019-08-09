import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import RSVP from 'rsvp';
import { run } from '@ember/runloop';
import { click, find, findAll, render, settled, waitFor } from '@ember/test-helpers';
import { typeInSearch, triggerKeydown } from 'ember-power-select/test-support/helpers';
import { numbers, countries } from '../constants';

module('Integration | Component | <PowerSelectTypeahead>', function(hooks) {
  setupRenderingTest(hooks);

  test('It can select options when options are strings', async function(assert) {
    assert.expect(4);
    this.numbers = numbers;
    await render(hbs`
      <PowerSelectTypeahead @options={{numbers}} @selected={{selected}} @onChange={{action (mut selected)}} as |number|>
        {{number}}
      </PowerSelectTypeahead>
    `);
    assert.notOk(find('.ember-power-select-dropdown'), 'The component is closed');
    await typeInSearch('tw');
    assert.ok(find('.ember-power-select-dropdown'), 'The component is opened');
    await click(findAll('.ember-power-select-option')[1]);
    assert.notOk(find('.ember-power-select-dropdown'), 'The component is closed again');
    assert.equal(find('.ember-power-select-search-input').value, 'twelve', 'The input contains the selected option');
  });

  test('It can select options when options are objects', async function(assert) {
    assert.expect(4);
    this.countries = countries;
    await render(hbs`
      <PowerSelectTypeahead @options={{countries}} @selected={{selected}} @onChange={{action (mut selected)}} @searchField="name" @extra={{hash labelPath="name"}} as |country|>
        {{country.name}}
      </PowerSelectTypeahead>
    `);
    assert.notOk(find('.ember-power-select-dropdown'), 'The component is closed');
    await typeInSearch('tat');
    assert.ok(find('.ember-power-select-dropdown'), 'The component is opened');
    await click(findAll('.ember-power-select-option')[0]);
    assert.notOk(find('.ember-power-select-dropdown'), 'The component is closed again');
    assert.equal(find('.ember-power-select-search-input').value, 'United States', 'The input contains the selected option');
  });

  test('Removing a few characters and selecting the same option that is already selected updates the text of the input', async function(assert) {
    assert.expect(5);
    this.countries = countries;
    this.selected = countries[2];
    await render(hbs`
      <PowerSelectTypeahead @options={{countries}} @selected={{selected}} @onChange={{action (mut selected)}} @searchField="name" @extra={{hash labelPath="name"}} as |country|>
        {{country.name}}
      </PowerSelectTypeahead>
    `);
    assert.notOk(find('.ember-power-select-dropdown'), 'The component is closed');
    await typeInSearch('Port');
    assert.ok(find('.ember-power-select-dropdown'), 'The component is opened');
    assert.equal(find('.ember-power-select-search-input').value, 'Port', 'The input contains the selected option');
    await click(findAll('.ember-power-select-option')[0]);
    assert.notOk(find('.ember-power-select-dropdown'), 'The component is closed again');
    assert.equal(find('.ember-power-select-search-input').value, 'Portugal', 'The input contains the selected option');
  });

  test('can search async with loading message', async function(assert) {
    assert.expect(6);
    this.searchCountriesAsync = () => {
      return new RSVP.Promise((resolve) => {
        run.later(() => {
          resolve(countries);
        }, 100);
      });
    };
    this.loadingMessage = 'searching...';
    await render(hbs`
      <PowerSelectTypeahead
        @search={{searchCountriesAsync}}
        @selected={{selected}}
        @loadingMessage={{loadingMessage}}
        @onChange={{action (mut selected)}}
        @extra={{hash labelPath="name"}} as |country|>
        {{country.name}}
      </PowerSelectTypeahead>
    `);
    typeInSearch('Uni');
    triggerKeydown('.ember-power-select-search-input', 85);
    await waitFor('.ember-power-select-option--loading-message');
    assert.equal(find('.ember-power-select-option--loading-message').textContent.trim(), this.loadingMessage, 'The loading message shows');
    assert.ok(find('.ember-power-select-dropdown'), 'The component open while searching');
    await settled();
    assert.ok(find('.ember-power-select-dropdown'), 'The component is opened');
    assert.equal(find('.ember-power-select-search-input').value, 'Uni', 'The input contains the selected option');
    await click(findAll('.ember-power-select-option')[0]);
    assert.notOk(find('.ember-power-select-dropdown'), 'The component is closed again');
    assert.equal(find('.ember-power-select-search-input').value, 'United States', 'The input contains the selected option');
  });

  test('search async with no loading message', async function(assert) {
    assert.expect(6);
    this.searchCountriesAsync = () => {
      return new RSVP.Promise((resolve) => {
        run.later(() => {
          resolve(countries);
        }, 100);
      });
    };
    await render(hbs`
      <PowerSelectTypeahead
        @search={{searchCountriesAsync}}
        @selected={{selected}}
        @onChange={{action (mut selected)}}
        @extra={{hash labelPath="name"}} as |country|>
        {{country.name}}
      </PowerSelectTypeahead>
    `);
    typeInSearch('Uni');
    triggerKeydown('.ember-power-select-search-input', 85);
    assert.notOk(find('.ember-power-select-option--loading-message'), 'No loading message if not configured');
    assert.notOk(find('.ember-power-select-dropdown'), 'The component is closed while searching');
    await settled();
    assert.ok(find('.ember-power-select-dropdown'), 'The component is opened');
    assert.equal(find('.ember-power-select-search-input').value, 'Uni', 'The input contains the selected option');
    await click(findAll('.ember-power-select-option')[0]);
    assert.notOk(find('.ember-power-select-dropdown'), 'The component is closed again');
    assert.equal(find('.ember-power-select-search-input').value, 'United States', 'The input contains the selected option');
  });

  test('search async with noMatchesMessage', async function(assert) {
    assert.expect(1);
    this.searchCountriesAsync = () => {
      return new RSVP.Promise((resolve) => {
        run.later(() => {
          resolve([]);
        }, 100);
      });
    };
    this.noMatchesMessage = 'no matches homie';
    await render(hbs`
      <PowerSelectTypeahead
        @search={{searchCountriesAsync}}
        @selected={{selected}}
        @noMatchesMessage={{noMatchesMessage}}
        @onChange={{action (mut selected)}}
        @extra={{hash labelPath="name"}} as |country|>
        {{country.name}}
      </PowerSelectTypeahead>
    `);
    typeInSearch('Uniwatttt');
    triggerKeydown('.ember-power-select-search-input', 85);
    await settled();
    assert.equal(find('.ember-power-select-option--no-matches-message').textContent.trim(), 'no matches homie');
  });

  test('search async without noMatchesMessage', async function(assert) {
    assert.expect(1);
    this.searchCountriesAsync = () => {
      return new RSVP.Promise((resolve) => {
        run.later(() => {
          resolve([]);
        }, 100);
      });
    };
    await render(hbs`
      <PowerSelectTypeahead
        @search={{searchCountriesAsync}}
        @selected={{selected}}
        @onChange={{action (mut selected)}}
        @extra={{hash labelPath="name"}} as |country|>
        {{country.name}}
      </PowerSelectTypeahead>
    `);
    typeInSearch('Uniwatttt');
    triggerKeydown('.ember-power-select-search-input', 85);
    await settled();
    assert.notOk(find('.ember-power-select-option--no-matches-message'), 'noMatchesMessage is null by default');
  });

  test('search async with no text will open and then close dropdown', async function(assert) {
    assert.expect(2);
    this.searchCountriesAsync = () => {
      return new RSVP.Promise((resolve) => {
        resolve(countries);
      });
    };
    await render(hbs`
      <PowerSelectTypeahead
        @search={{searchCountriesAsync}}
        @selected={{selected}}
        @onChange={{action (mut selected)}}
        @extra={{hash labelPath="name"}} as |country|>
        {{country.name}}
      </PowerSelectTypeahead>
    `);
    typeInSearch('Uni');
    await triggerKeydown('.ember-power-select-search-input', 85);
    assert.ok(find('.ember-power-select-dropdown'), 'The component is opened');
    await typeInSearch('');
    assert.notOk(find('.ember-power-select-dropdown'), 'The component is closed');
  });

  test('The dropdown doesnt have a "button" role', async function(assert) {
    assert.expect(1);
    this.numbers = numbers;
    await render(hbs`
      <PowerSelectTypeahead
        @options={{numbers}}
        @selected={{selected}}
        @onChange={{action (mut selected)}} as |number|>
        {{number}}
      </PowerSelectTypeahead>
    `);
    assert.notOk(find('.ember-power-select-trigger').getAttribute('role'), 'The trigger does not have button role');
  });
});
