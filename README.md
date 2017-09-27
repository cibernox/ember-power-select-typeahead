# Ember-power-select-typeahead

Naive implementation of a typeahead component on top of ember-power-select.

[Demo](https://ember-power-select-typeahead.pagefrontapp.com/)

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

## Options

To enable the dropdown to stay open in between searches (ie., while the component
is performing a new search action after input has changed), pass
`keepOpenOnLoad=true` to the `extra` hash attribute.

## Styles

In your app's stylesheet, you must import the built-in styles in this order:

```css
/*
your custom variables goes here
*/

/*if using a theme
@import 'ember-power-select/themes/material';
*/

@import 'power-select';
@import 'ember-power-select-typeahead';
```
