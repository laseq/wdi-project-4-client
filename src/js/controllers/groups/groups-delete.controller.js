angular
  .module('stagApp')
  .controller('GroupsDeleteCtrl', GroupsDeleteCtrl);

GroupsDeleteCtrl.$inject = ['group','$uibModalInstance', '$state', 'Group'];
function GroupsDeleteCtrl(group, $uibModalInstance, $state, Group) {

  const vm = this;
  vm.group = group;
  vm.close = closeModal;
  vm.delete = groupsDelete;

  function closeModal() {
    $uibModalInstance.close();
  }

  function groupsDelete() {
    Group
      .remove({ id: group.id })
      .$promise
      .then(() => {
        $uibModalInstance.close();
        $state.go('dashboard');
      })
      .catch(err => {
        console.log(err);
      });
  }

}
