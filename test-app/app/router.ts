import EmberRouter from '@embroider/router';
import config from 'test-app/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('helpers-testing');
  this.route('helpers-testing-single-power-select');
});
