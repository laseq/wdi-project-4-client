angular
  .module('stagApp')
  .controller('DashboardCtrl', DashboardCtrl);

DashboardCtrl.$inject = ['Group', 'User', 'CurrentUserService', 'TokenService'];
function DashboardCtrl(Group, User, CurrentUserService, TokenService) {
  const vm = this;

  vm.user = User.get({ id: TokenService.decodeToken().id });
  vm.groups = Group.userGroups();

  // displayUserGroups();
  //
  // function displayUserGroups() {
  //   Group
  //     .userGroups()
  //     .$promise
  //     .then(groups => {
  //       console.log('user\'s groups:', groups);
  //       vm.groups = groups;
  //     });
  // }

}
