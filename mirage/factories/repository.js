import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  slug: 'travis-ci/travis-web',
  owner: 'travis-ci',
  githubLanguage: 'ruby',
  active: true,
  permissions: {
    enable: true,
    disable: true
  }
});
