angular
  .module('stagApp')
  .factory('Group', Group);

Group.$inject = ['$resource', 'API'];
function Group($resource, API) {
  return $resource(`${API}/groups/:id`, { id: '@_id' },
    {
      'update': { method: 'PUT' },
      'userGroups': { method: 'GET', url: `${API}/user-groups`, isArray: true }
    }
  );
}
