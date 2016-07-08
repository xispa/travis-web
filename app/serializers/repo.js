import Ember from 'ember';
import V2FallbackSerializer from 'travis/serializers/v2_fallback';
import EmbeddedRecordsMixin from 'ember-data/serializers/embedded-records-mixin';

var Serializer = V2FallbackSerializer.extend(EmbeddedRecordsMixin, {
  isNewSerializerAPI: true,

  attrs: {
    permissions: {
      serialize: 'records',
      deserialize: false
    }
  },

  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    if(!id && requestType === 'findRecord') {
      id = payload.id;
    }

    payload.repositories = payload.repositories.map((repo) => {
      repo.permissions = repo["@permissions"];
      return repo;
    });

    console.log('normalized payload', payload);

    return this._super(store, primaryModelClass, payload, id, requestType);
  },

  // extractMeta(store, type, payload) {
    // TODO: set pagination metadata here
    // store.setMetadataFor(type, { permissions: payload
  // }
});

export default Serializer;
