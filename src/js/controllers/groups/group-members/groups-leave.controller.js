angular
  .module('stagApp')
  .controller('GroupLeaveCtrl', GroupLeaveCtrl);

GroupLeaveCtrl.$inject = ['user', 'group', '$uibModalInstance', '$state', 'Request'];
function GroupLeaveCtrl(user, group, $uibModalInstance, $state, Request) {

  const vm = this;
  vm.close = closeModal;
  vm.user = user;
  vm.group = group;
  vm.leave = userLeaveGroup;

  function userLeaveGroup() {
    const deleteObj = {
      group_id: vm.group.id,
      receiver_id: vm.user.id
    };

    Request
      .removeByGroupAndUserId(deleteObj)
      .$promise
      .then(() => {
        $state.go('dashboard');
        $uibModalInstance.close();
      });
  }

  function closeModal() {
    $uibModalInstance.close();
  }

}
