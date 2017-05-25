import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  host: 'https://simple-investing-app.herokuapp.com',
  namespace: 'api'
});
