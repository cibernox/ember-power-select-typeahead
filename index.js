'use strict';

module.exports = {
  // eslint-disable-next-line node/no-unpublished-require
  name: require('./package').name,

  contentFor(type, config) {
    const emberPowerSelect = this.addons.find(addon => addon.name === 'ember-power-select');
    return emberPowerSelect.contentFor(type, config);
  }
};
