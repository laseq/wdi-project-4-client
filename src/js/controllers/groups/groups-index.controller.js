angular
  .module('stagApp')
  .controller('GroupsIndexCtrl', GroupsIndexCtrl);

GroupsIndexCtrl.$inject = ['Group', 'CurrentUserService'];
function GroupsIndexCtrl(Group, CurrentUserService) {
  const vm = this;
  // vm.groupCreator = checkGroupCreator;
  vm.currentUser = CurrentUserService.currentUser;

  // groupsIndex();
  displayUserGroups();

  function displayUserGroups() {
    Group
      .userGroups()
      .$promise
      .then(groups => {
        vm.groups = groups;
      });
  }

}
