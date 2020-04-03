// Types for compiled templates
declare module 'ember-power-select-typeahead/templates/*' {
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  const tmpl: TemplateFactory;
  export default tmpl;
}
