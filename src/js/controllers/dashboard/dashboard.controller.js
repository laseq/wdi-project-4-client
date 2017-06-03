angular
  .module('stagApp')
  .controller('DashboardCtrl', DashboardCtrl);

DashboardCtrl.$inject = ['Group', 'CurrentUserService'];
function DashboardCtrl(Group, CurrentUserService) {
  const vm = this;
  CurrentUserService.getUser();
  vm.currentUser = CurrentUserService.currentUser;

  displayUserGroups();

  function displayUserGroups() {
    Group
      .userGroups()
      .$promise
      .then(groups => {
        // console.log('user\'s groups:', groups);
        vm.groups = groups;
      });
  }

}
