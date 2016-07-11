import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';
import Repo from 'travis/models/repo';

export default TravisRoute.extend({
  titleToken(model) {
    let { account } = model;
    if (account) {
      return account.get('name') || account.get('login');
    } else {
      return 'Account';
    }
  },

  model(params) {
    return Ember.RSVP.hash({
      account: this.fetchAccount(params.login),
      repositories: Repo.byOwner(this.store, params.login)
    });
  },

  actions: {
    loading(transition, originRoute) {
      let controller = this.controllerFor('account');
      controller.set('loadingRepositoryData', true);
      transition.promise.finally(() => {
        controller.set('loadingRepositoryData', false);
      });
    }
  },

  fetchAccount(login) {
    return this.modelFor('accounts').find(function(account) {
      return account.get('login') === login;
    });
  },

  serialize(account) {
    if (account && account.get) {
      return {
        login: account.get('login')
      };
    } else {
      return {};
    }
  }
});
