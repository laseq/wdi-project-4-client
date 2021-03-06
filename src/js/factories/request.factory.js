// I need to change the $resource link here to point to the actual request routing

angular
  .module('stagApp')
  .factory('Request', Request);

Request.$inject = ['$resource', 'API'];
function Request($resource, API) {
  return $resource(`${API}/group_invites/:id`,
    { id: '@_id' },
    {
      'update': { method: 'PUT' },
      'getPendingRequests': { method: 'GET', url: `${API}/group_invites/pending`, isArray: true },
      'sendMassRequest': { method: 'POST', url: `${API}/group_invites/mass`, isArray: true },
      'removeByGroupAndUserId': { method: 'DELETE', url: `${API}/group_invites/remove_by_group_and_user` }
    }
  );
}
