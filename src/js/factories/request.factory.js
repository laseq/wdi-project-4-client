// I need to change the $resource link here to point to the actual request routing

angular
  .module('stagApp')
  .factory('Request', Request);

Request.$inject = ['$resource', 'API'];
function Request($resource, API) {
  return $resource(`${API}/requests/:id`,
    { id: '@_id' },
    {
      'update': { method: 'PUT' }
    }
  );
}
