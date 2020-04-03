import {module, test} from 'qunit';
import {setupRenderingTest} from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import RSVP from 'rsvp';
import {run} from '@ember/runloop';
import {click, find, findAll, render, settled, waitFor} from '@ember/test-helpers';
// @ts-ignore
import {typeInSearch, triggerKeydown} from 'ember-power-select/test-support/helpers';
import {STRING_NUMBERS, COUNTRIES, Country} from '../constants';
import {TestContext} from 'ember-test-helpers';

interface Context extends TestContext {
  numbers: string[];
  countries: Country[];
  selected: Country;

  searchCountriesAsync(): RSVP.Promise<Country[]>;

  loadingMessage: string;
  noMatchesMessage: string;
}

module('Integration | Component | <PowerSelectTypeahead>', function (hooks: NestedHooks) {
  setupRenderingTest(hooks);

  test('It can select options when options are strings', async function (this: Context, assert: Assert) {
    assert.expect(4);

    this.numbers = STRING_NUMBERS;

    await render(hbs`
      <PowerSelectTypeahead
        @options={{numbers}}
        @selected={{selected}}
        @onChange={{fn (mut selected)}} as |number|>
        {{number}}
      </PowerSelectTypeahead>
    `);

    assert.dom('.ember-power-select-dropdown').doesNotExist('The component is closed');
    await typeInSearch('tw');

    assert.dom('.ember-power-select-dropdown').exists('The component is opened');
    await click(findAll('.ember-power-select-option')[1]);

    assert.dom('.ember-power-select-dropdown').doesNotExist('The component is closed again');
    assert.dom('.ember-power-select-search-input').hasValue('twelve', 'The input contains the selected option');
  });

  test('It can select options when options are objects', async function (this: Context, assert: Assert) {
    assert.expect(4);

    this.countries = COUNTRIES;

    await render(hbs`
      <PowerSelectTypeahead
        @options={{countries}}
        @selected={{selected}}
        @onChange={{fn (mut selected)}}
        @searchField="name"
        @extra={{hash labelPath="name"}} as |country|>
        {{country.name}}
      </PowerSelectTypeahead>
    `);

    assert.dom('.ember-power-select-dropdown').doesNotExist('The component is closed');
    await typeInSearch('tat');

    assert.dom('.ember-power-select-dropdown').exists('The component is opened');
    await click(findAll('.ember-power-select-option')[0]);

    assert.dom('.ember-power-select-dropdown').doesNotExist('The component is closed again');
    assert.dom('.ember-power-select-search-input').hasValue('United States', 'The input contains the selected option');
  });

  test('Removing a few characters and selecting the same option that is already selected updates the text of the input', async function (this: Context, assert: Assert) {
    assert.expect(5);

    this.countries = COUNTRIES;
    this.selected = COUNTRIES[2];

    await render(hbs`
      <PowerSelectTypeahead
        @options={{countries}}
        @selected={{selected}}
        @onChange={{fn (mut selected)}}
        @searchField="name"
        @extra={{hash labelPath="name"}} as |country|>
        {{country.name}}
      </PowerSelectTypeahead>
    `);

    assert.dom('.ember-power-select-dropdown').doesNotExist('The component is closed');
    await typeInSearch('Port');

    assert.dom('.ember-power-select-dropdown').exists('The component is opened');
    assert.dom('.ember-power-select-search-input').hasValue('Port', 'The input contains the selected option');
    await click(findAll('.ember-power-select-option')[0]);

    assert.dom('.ember-power-select-dropdown').doesNotExist('The component is closed again');
    assert.dom('.ember-power-select-search-input').hasValue('Portugal', 'The input contains the selected option');
  });

  test('can search async with loading message', async function (this: Context, assert: Assert) {
    assert.expect(6);

    this.searchCountriesAsync = (): RSVP.Promise<Country[]> => {
      return new RSVP.Promise((resolve) => {
        run.later(() => {
          resolve(COUNTRIES);
        }, 100);
      });
    };
    this.loadingMessage = 'searching...';

    await render(hbs`
      <PowerSelectTypeahead
        @search={{searchCountriesAsync}}
        @selected={{selected}}
        @loadingMessage={{loadingMessage}}
        @onChange={{fn (mut selected)}}
        @extra={{hash labelPath="name"}} as |country|>
        {{country.name}}
      </PowerSelectTypeahead>
    `);

    typeInSearch('Uni');
    triggerKeydown('.ember-power-select-search-input', 85);
    await waitFor('.ember-power-select-option--loading-message');

    assert.dom('.ember-power-select-option--loading-message').hasText(this.loadingMessage, 'The loading message shows');
    assert.dom('.ember-power-select-dropdown').exists('The component open while searching');
    await settled();

    assert.dom('.ember-power-select-dropdown').exists('The component is opened');
    assert.dom('.ember-power-select-search-input').hasValue('Uni', 'The input contains the selected option');
    await click(findAll('.ember-power-select-option')[0]);

    assert.dom('.ember-power-select-dropdown').doesNotExist('The component is closed again');
    assert.dom('.ember-power-select-search-input').hasValue('United States', 'The input contains the selected option');
  });

  test('search async with no loading message', async function (this: Context, assert: Assert) {
    assert.expect(6);

    this.searchCountriesAsync = (): RSVP.Promise<Country[]> => {
      return new RSVP.Promise((resolve) => {
        run.later(() => {
          resolve(COUNTRIES);
        }, 100);
      });
    };

    await render(hbs`
      <PowerSelectTypeahead
        @search={{searchCountriesAsync}}
        @selected={{selected}}
        @onChange={{fn (mut selected)}}
        @extra={{hash labelPath="name"}} as |country|>
        {{country.name}}
      </PowerSelectTypeahead>
    `);

    typeInSearch('Uni');
    triggerKeydown('.ember-power-select-search-input', 85);

    assert.dom('.ember-power-select-option--loading-message').doesNotExist('No loading message if not configured');
    assert.dom('.ember-power-select-dropdown').doesNotExist('The component is closed while searching');
    await settled();

    assert.dom('.ember-power-select-dropdown').exists('The component is opened');
    assert.dom('.ember-power-select-search-input').hasValue('Uni', 'The input contains the selected option');
    await click(findAll('.ember-power-select-option')[0]);

    assert.dom('.ember-power-select-dropdown').doesNotExist('The component is closed again');
    assert.dom('.ember-power-select-search-input').hasValue('United States', 'The input contains the selected option');
  });

  test('search async with noMatchesMessage', async function (this: Context, assert: Assert) {
    assert.expect(1);

    this.searchCountriesAsync = (): RSVP.Promise<Country[]> => {
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
        @noMatchesMessage={{this.noMatchesMessage}}
        @onChange={{fn (mut selected)}}
        @extra={{hash labelPath="name"}} as |country|>
        {{country.name}}
      </PowerSelectTypeahead>
    `);

    typeInSearch('Uniwatttt');
    triggerKeydown('.ember-power-select-search-input', 85);
    await settled();

    assert.dom('.ember-power-select-option--no-matches-message').hasText('no matches homie');
  });

  test('search async without noMatchesMessage', async function (this: Context, assert: Assert) {
    assert.expect(1);

    this.searchCountriesAsync = (): RSVP.Promise<Country[]> => {
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
        @onChange={{fn (mut selected)}}
        @extra={{hash labelPath="name"}} as |country|>
        {{country.name}}
      </PowerSelectTypeahead>
    `);

    typeInSearch('Uniwatttt');
    triggerKeydown('.ember-power-select-search-input', 85);
    await settled();

    assert.dom('.ember-power-select-option--no-matches-message').doesNotExist('noMatchesMessage is null by default');
  });

  test('search async with no text will open and then close dropdown', async function (this: Context, assert: Assert) {
    assert.expect(2);

    this.searchCountriesAsync = (): RSVP.Promise<Country[]> => {
      return new RSVP.Promise((resolve) => {
        resolve(COUNTRIES);
      });
    };

    await render(hbs`
      <PowerSelectTypeahead
        @search={{searchCountriesAsync}}
        @selected={{selected}}
        @onChange={{fn (mut selected)}}
        @extra={{hash labelPath="name"}} as |country|>
        {{country.name}}
      </PowerSelectTypeahead>
    `);

    typeInSearch('Uni');
    await triggerKeydown('.ember-power-select-search-input', 85);

    assert.dom('.ember-power-select-dropdown').exists('The component is opened');
    await typeInSearch('');

    assert.dom('.ember-power-select-dropdown').doesNotExist('The component is closed');
  });

  test('The dropdown doesnt have a "button" role', async function (this: Context, assert: Assert) {
    assert.expect(1);

    this.numbers = STRING_NUMBERS;

    await render(hbs`
      <PowerSelectTypeahead
        @options={{numbers}}
        @selected={{selected}}
        @onChange={{fn (mut selected)}} as |number|>
        {{number}}
      </PowerSelectTypeahead>
    `);

    assert.notOk(find('ember-power-select-typeahead-input')?.getAttribute('role'), 'The trigger does not have button role');
  });
});
