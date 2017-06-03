// I need to change the $resource link here to point to the actual request routing

angular
  .module('stagApp')
  .factory('Request', Request);

Request.$inject = ['$resource', 'API'];
function Request($resource, API) {
  return $resource(`${API}/group_invite/:id`,
    { id: '@_id' },
    {
      'update': { method: 'PUT' },
      'getPendingRequests': { method: 'GET', url: `${API}/group_invite/pending`, isArray: true }
    }
  );
}
