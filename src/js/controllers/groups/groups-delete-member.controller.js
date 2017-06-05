angular
  .module('stagApp')
  .controller('GroupsDeleteMembersCtrl', GroupsDeleteMembersCtrl);

GroupsDeleteMembersCtrl.$inject = ['group', 'User', 'Request', '$uibModalInstance', '$state'];
function GroupsDeleteMembersCtrl(group, User, Request, $uibModalInstance, $state) {

  const vm = this;
  vm.close = closeModal;
  vm.group = group;
  vm.deleteMember = deleteMember;
  vm.currentMembers = group.accepted_members;

  function deleteMember($event, $index, userId) {

    const deleteObj = {
      group_id: vm.group.id,
      receiver_id: userId
    };

    Request
      .removeByGroupAndUserId(deleteObj)
      .$promise
      .then(() => {
        console.log('Deleted member?');
        vm.currentMembers.splice($index, 1);
      });
  }

  function closeModal() {
    $uibModalInstance.close(vm.group);
  }

}
