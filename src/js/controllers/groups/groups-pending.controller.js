angular
  .module('stagApp')
  .controller('GroupsPendingCtrl', GroupsPendingCtrl);

GroupsPendingCtrl.$inject = ['group', 'User', 'Request', '$uibModalInstance', '$state'];
function GroupsPendingCtrl(group, User, Request, $uibModalInstance, $state) {

  const vm = this;
  vm.close = closeModal;
  vm.group = group;
  vm.remove = removeUserFromList;
  vm.deleteRequest = deletePendingRequest;
  vm.pendingMembers = group.pending_members;
  vm.deletionTakenPlace = false;

  function removeUserFromList($index) {
    vm.usersToInvite.splice($index, 1);
  }

  function deletePendingRequest($event, $index, userId) {

    const deleteObj = {
      group_id: vm.group.id,
      receiver_id: userId
    };

    Request
      .removeByGroupAndUserId(deleteObj)
      .$promise
      .then(() => {
        console.log('Deleted pending request?');
        vm.pendingMembers.splice($index, 1);
        vm.deletionTakenPlace = true;
      });
  }


  function closeModal() {
    if (vm.deletionTakenPlace) {
      $uibModalInstance.close(vm.group);
    } else {
      $uibModalInstance.close();
    }
  }

}
