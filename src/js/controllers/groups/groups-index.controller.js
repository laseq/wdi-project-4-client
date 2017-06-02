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

  // function groupsIndex() {
  //   vm.groups = Group.query();
  // }

  function displayUserGroups() {
    Group
      .userGroups()
      .$promise
      .then(groups => {
        console.log('user\'s groups:', groups);
        vm.groups = groups;
      });
  }

  // function checkGroupCreator(creatorId) {
  //   if (creatorId === vm.currentUser.id) {
  //     console.log('Entered creatorId true');
  //     console.log('creatorId:', creatorId);
  //     console.log('vm.currentUser.id:', vm.currentUser.id);
  //     return true;
  //   } else {
  //     console.log('Entered creatorId false');
  //     console.log('creatorId:', creatorId);
  //     console.log('vm.currentUser.id:', vm.currentUser.id);
  //     return false;
  //   }
  // }

}
