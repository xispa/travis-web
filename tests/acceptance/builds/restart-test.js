import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | builds/restart', {
  beforeEach() {
    window.localStorage.clear();
    window.sessionStorage.clear();
    const currentUser = server.create('user');
    // console.log(JSON.stringify(currentUser.attrs));
    localStorageUser = JSON.parse(JSON.stringify(currentUser.attrs));
    localStorageUser.token = "abc123";
    // console.log(JSON.stringify(localStorageUser));
    window.localStorage.setItem('travis.token', 'testUserToken');
    window.localStorage.setItem('travis.user', JSON.stringify(localStorageUser));
  },

  afterEach() {
    window.localStorage.clear();
    window.sessionStorage.clear();
  }
});

QUnit.only('restarting build', function(assert) {
  let repo =  server.create('repository', {slug: 'travis-ci/travis-web'});
  let branch = server.create('branch', {});
  let commit = server.create('commit', {author_email: 'mrt@travis-ci.org', author_name: 'Mr T', committer_email: 'mrt@travis-ci.org', committer_name: 'Mr T', branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true});
  let build = server.create('build', {number: '5', repository_id: repo.id, state: 'passed', commit_id: commit.id});
  let job = server.create('job', {number: '1234.1', repository_id: repo.id, state: 'passed', build_id: build.id, commit_id: commit.id});
  let log = server.create('log', { id: job.id });

  visit(`/travis-ci/travis-web/builds/${build.id}`);

  andThen(function() {
    assert.equal(currentURL(), '/travis-ci/travis-web/builds/1');
  });
});
