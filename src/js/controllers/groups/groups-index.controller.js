angular
  .module('stagApp')
  .controller('GroupsIndexCtrl', GroupsIndexCtrl);

GroupsIndexCtrl.$inject = ['Group'];
function GroupsIndexCtrl(Group) {
  const vm = this;

  groupsIndex();

  function groupsIndex() {
    vm.groups = Group.query();
  }

}
