import Controller from '@ember/controller';
import RSVP from 'rsvp';
import {run} from '@ember/runloop';
import {action} from '@ember/object';
import {Select} from 'ember-power-select/addon/components/power-select';
import {tracked} from '@glimmer/tracking';

interface User {
  name: string;
}

const USERS: User[] = [
  {name: 'Arthur'},
  {name: 'Sam'},
  {name: 'Dan'},
  {name: 'Miguel'},
  {name: 'Svilen'},
  {name: 'Ruslan'},
  {name: 'Kirill'},
  {name: 'Stuart'},
  {name: 'Jamie'},
  {name: 'Matteo'}
];
const EXTRA = {labelPath: 'name'};

export default class ApplicationController extends Controller {

  @tracked user?: User;
  @tracked user2?: User;
  @tracked user3?: User;

  get users(): User[] {
    return USERS;
  }

  get extra(): { labelPath: string } {
    return EXTRA;
  }

  @action
  skipShortSearches(term: string, select: Select): string | false | void {
    if (term.length <= 2) {
      select.actions.search('');
      return false;
    }
  }

  @action
  searchUsersAsync(term: string): RSVP.Promise<User[]> {
    return new RSVP.Promise(function (resolve) {
      if (term.length === 0) {
        resolve([]);
      } else {
        run.later(function () {
          resolve(USERS.filter((u) => u.name.indexOf(term) > -1));
        }, 600);
      }
    });
  }
}
