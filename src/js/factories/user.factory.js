angular
  .module('stagApp')
  .factory('User', userFactory);

userFactory.$inject = ['API', '$resource'];
function userFactory(API, $resource){
  return $resource(`${API}/users/:id`, { id: '@_id'}, {
    'update': { method: 'PUT' },
    register: { method: 'POST', url: `${API}/register` },
    login: { method: 'POST', url: `${API}/login` },
    'findByEmail': { method: 'GET',
      url: `${API}/users/search_by_email/:email`,
      params: {
        email: '@email'
      }
    }
  });
}
