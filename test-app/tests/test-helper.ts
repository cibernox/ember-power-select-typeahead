import Application from 'test-app/app';
import config from 'test-app/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start as qunitStart, setupEmberOnerrorValidation } from 'ember-qunit';
import { setConfig as setBasicDropdownConfig } from 'ember-basic-dropdown/config';
import { setTesting } from '@embroider/macros';

export function start() {
  // Tells `@embroider/macros` runtime that this is a test build.
  // Without this, ember-basic-dropdown's `animateInAndOut` modifier creates
  // a DOM clone of the dropdown on close, which races with `find()` in tests.
  setTesting(true);

  setBasicDropdownConfig({ destination: 'ember-basic-dropdown-wormhole' });
  setApplication(Application.create(config.APP));

  setup(QUnit.assert);
  setupEmberOnerrorValidation();

  qunitStart();
}
