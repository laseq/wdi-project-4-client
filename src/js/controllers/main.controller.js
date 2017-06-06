angular
  .module('stagApp')
  .controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['$http', 'CurrentUserService', 'TokenService', '$rootScope', '$state'];
function MainCtrl($http, CurrentUserService, TokenService, $rootScope, $state) {
  const vm = this;
  CurrentUserService.getUser();

  vm.isNavCollapsed = true;

  $rootScope.$on('loggedIn', () => {
    vm.user = CurrentUserService.currentUser;
  });

  $rootScope.$on('loggedOut', () => {
    vm.user = null;
    $state.go('login');
  });

  // $rootScope.$on('$stateChangeError', (event, toState, toParams, fromState, fromParams, error) => {
  //   event.preventDefault();
  //   console.log('CAUGHT');
  // });

  vm.logout = () => {
    CurrentUserService.removeUser();
  };

}
