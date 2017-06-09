angular
  .module('stagApp')
  .factory('Event', Event);

Event.$inject = ['$resource', 'API'];
function Event($resource, API) {
  return $resource(`${API}/groups/:group_id/events/:id`, { group_id: '@group_id', id: '@_id' },
    {
      'update': { method: 'PUT' },
      'attendance': { method: 'POST', url: `${API}/groups/:group_id/events/:id/attendance` }
    }
  );
}
