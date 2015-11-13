import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('power-select-typeahead/selected', 'Integration | Component | power select typeahead/selected', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{power-select-typeahead/selected}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#power-select-typeahead/selected}}
      template block text
    {{/power-select-typeahead/selected}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
