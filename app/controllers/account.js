import Ember from 'ember';
import Repo from 'travis/models/repo';

const { service } = Ember.inject;
const { alias } = Ember.computed;

export default Ember.Controller.extend({
  auth: service(),
  permissions: service(),
  allHooks: [],
  user: alias('auth.currentUser'),
  repositoriesLoaded: false,

  init() {
    var self;
    this._super(...arguments);
    self = this;
    return Travis.on("user:synced", (function() {
      return self.reloadHooks();
    }));
  },

  actions: {
    sync() {
      return this.get('user').sync();
    },

    toggle(hook) {
      return hook.toggle();
    }
  },

  reloadHooks() {
    let login = this.get('model.login');
    if (login) {
      Repo.byOwner(this.store, login).then((repos) => {
        this.set('allHooks', repos);
        this.toggleProperty('repositoriesLoaded');
      });
    }
  },

  accountName: function() {
    return this.get('model.name') || this.get('model.login');
  }.property('model.name', 'model.login'),

  hooks: function() {
    let hooks = this.get('allHooks');

    if (!(hooks)) {
      this.reloadHooks();
    }

    let permissions = this.get('permissions');
    let currentUser = this.get('auth.currentUser');

    let filtered = this.get('allHooks').filter(function(hook) {
      return permissions.hasAdminPermission(hook);
    });

    return filtered;
  }.property('allHooks.length', 'allHooks'),

  hooksWithoutAdmin: function() {
    let hooks = this.get('allHooks');

    if (!(hooks)) {
      this.reloadHooks();
    }

    let permissions = this.get('permissions');

    return this.get('allHooks').filter(function(hook) {
      return !permissions.hasAdminPermission(hook);
    });
  }.property('allHooks.length', 'allHooks'),

  showPrivateReposHint: function() {
    return this.config.show_repos_hint === 'private';
  }.property(),

  showPublicReposHint: function() {
    return this.config.show_repos_hint === 'public';
  }.property(),

  billingUrl: function() {
    var id;
    id = this.get('model.type') === 'user' ? 'user' : this.get('model.login');
    return this.config.billingEndpoint + "/subscriptions/" + id;
  }.property('model.name', 'model.login'),

  subscribeButtonInfo: function() {
    return {
      billingUrl: this.get('billingUrl'),
      subscribed: this.get('model.subscribed'),
      education: this.get('model.education')
    };
  }.property('model.login', 'model.type')
});
