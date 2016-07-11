import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import profilePage from 'travis/tests/pages/profile';

moduleForAcceptance('Acceptance | profile', {
  beforeEach() {
    const currentUser = server.create('user', {
      name: 'Sara Ahmed',
      login: 'feministkilljoy',
      repos_count: 3
    });

    signInUser(currentUser);

    const organization = server.create('account', {
      name: 'Feminist Killjoys',
      type: 'organization',
      login: 'killjoys',
      repos_count: 30
    });

    const activeHook = server.create('repository', {
      slug: 'feministkilljoy/living-a-feminist-life',
      owner: 'feministkilljoy',
      active: true,
      permissions: {
        enable: true,
        disable: true
      }
    });

    const inactiveHook = server.create('repository', {
      slug: 'feministkilljoy/willful-subjects',
      owner: 'feministkilljoy',
      active: false,
      permissions: {
        enable: true,
        disable: true
      }
    });

    const unadministerableHook = server.create('repository', {
      slug: 'feministkilljoy/affect-theory-reader',
      owner: 'feministkilljoy',
      active: true,
      permissions: {
        enable: false,
        disable: false
      }
    });

    const otherHook = server.create('repository', {
      slug: 'bellhooks/feminism-is-for-everybody',
      owner: 'bellhooks',
      active: false,
      permissions: {
        enable: false,
        disable: false
      }
    });
  }
});

test('view profile', function(assert) {
  profilePage.visit({username: 'feministkilljoy'});

  andThen(function() {
    assert.equal(profilePage.name, 'Sara Ahmed');

    assert.equal(profilePage.accounts().count, 2, 'expected two accounts');

    assert.equal(profilePage.accounts(0).name, 'Sara Ahmed');
    assert.equal(profilePage.accounts(0).repositoryCount, 3);

    assert.equal(profilePage.accounts(1).name, 'Feminist Killjoys');
    assert.equal(profilePage.accounts(1).repositoryCount, 30);

    assert.equal(profilePage.administerableRepos().count, 2, 'expected two administerable hooks');

    assert.equal(profilePage.administerableRepos(0).name, 'feministkilljoy/living-a-feminist-life');
    assert.ok(profilePage.administerableRepos(0).isActive, 'expected active hook to appear active');

    assert.equal(profilePage.administerableRepos(1).name, 'feministkilljoy/willful-subjects');
    assert.notOk(profilePage.administerableRepos(1).isActive, 'expected inactive hook to appear inactive');

    assert.equal(profilePage.unadministerableRepos().count, 1, 'expected one unadministerable hook');
  });
});

test('view token', function(assert) {
  profilePage.visit({username: 'feministkilljoy'});

  andThen(() => {
    assert.ok(profilePage.token.isHidden, 'expected token to be hidden by default');
  });

  profilePage.token.show();

  andThen(function() {
    assert.equal(profilePage.token.value, 'testUserToken');
  });
});

test('updating hooks', function(assert) {
  profilePage.visit({username: 'feministkilljoy'});

  profilePage.administerableRepos(0).toggle();
  profilePage.administerableRepos(1).toggle();
  profilePage.unadministerableRepos(0).toggle();

  andThen(() => {
    assert.notOk(server.db.repositories[0].active, 'expected formerly active hook to be inactive');
    assert.ok(server.db.repositories[1].active, 'expected formerly inactive hook to be active');
    assert.ok(server.db.repositories[2].active, 'expected unadministerable hook to be unchanged');
  });
});
