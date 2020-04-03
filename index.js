/* eslint-disable @typescript-eslint/explicit-function-return-type */
'use strict';

module.exports = {
  name: require('./package').name,

  contentFor(type, config) {
    const emberPowerSelect = this.addons.find(addon => addon.name === 'ember-power-select');
    return emberPowerSelect.contentFor(type, config);
  }
};
