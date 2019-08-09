# Ember-power-select-typeahead

Naive implementation of a typeahead component on top of ember-power-select.


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.4 or above
* Ember CLI v2.13 or above
* Node.js v8 or above


Installation
------------------------------------------------------------------------------

## Installation

```
ember install ember-power-select-typeahead
```

## Usage

With simple strings:

```hsb
{{#power-select-typeahead search=(action 'searchAsync') selected=selected onchange=(action (mut selected)) as |number|}}
  {{number}}
{{/power-select-typeahead}}
```

With complex objects:

```hsb
{{#power-select-typeahead search=(action 'searchAsync') selected=selected extra=(hash labelPath="name") onchange=(action (mut selected)) as |user|}}
  {{user.name}}
{{/power-select-typeahead}}
```
***Note: See API reference for ember-power-select for additional options you can pass to ember-power-select-typeahead***
- http://ember-power-select.com/docs/api-reference

## Styles

In your app's stylesheet, you must import the built-in styles in this order:

```css
/*
your custom variables goes here
*/

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

@import 'ember-power-select';
@import 'ember-power-select-typeahead';
```
