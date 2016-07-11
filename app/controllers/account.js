import Ember from 'ember';
import Repo from 'travis/models/repo';

const { service } = Ember.inject;
const { alias } = Ember.computed;

export default Ember.Controller.extend({
  auth: service(),
  permissions: service(),
  allRepositories: [],
  user: alias('auth.currentUser'),

  actions: {
    sync() {
      return this.get('user').sync();
    },

    toggle(hook) {
      return hook.toggle();
    }
  },

  account: Ember.computed.alias('model.account'),

  accountName: function() {
    return this.get('account.name') || this.get('account.login');
  }.property('account.name', 'account.login'),

  repositories: Ember.computed('model.repositories.[]', function() {
    return this.get('model.repositories').filter((repo) => {
      return repo.get('toggleable');
    });
  }),

  repositoriesWithoutAdmin: Ember.computed('model.repositories.[]', function() {
    return this.get('model.repositories').filter((repo) => {
      return !repo.get('toggleable');
    });
  }),

  showPrivateReposHint: function() {
    return this.config.show_repos_hint === 'private';
  }.property(),

  showPublicReposHint: function() {
    return this.config.show_repos_hint === 'public';
  }.property(),

  billingUrl: function() {
    var id;
    id = this.get('account.type') === 'user' ? 'user' : this.get('account.login');
    return this.config.billingEndpoint + "/subscriptions/" + id;
  }.property('account.name', 'account.login'),

  subscribeButtonInfo: function() {
    return {
      billingUrl: this.get('billingUrl'),
      subscribed: this.get('account.subscribed'),
      education: this.get('account.education')
    };
  }.property('account.login', 'account.type')
});
