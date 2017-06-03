angular
.module('stagApp')
.controller('GroupsEditCtrl', GroupsEditCtrl);

GroupsEditCtrl.$inject = ['$stateParams', '$state', 'Group', '$uibModal'];
function GroupsEditCtrl($stateParams, $state, Group, $uibModal){
  const vm = this;
  vm.group = Group.get($stateParams);
  vm.update = groupUpdate;
  vm.delete = groupsDelete;
  vm.openDelete = openDeleteModal;

  function groupUpdate(){
    Group
    .update({ id: $stateParams.id }, vm.group)
    .$promise
    .then(()=>{
      $state.go('groupsShow', { id: vm.group.id });
    });
  }

  function groupsDelete() {
    Group
      .delete({ id: vm.group.id })
      .$promise
      .then(() => {
        $state.go('dashboard');
      });
  }

  function openDeleteModal() {
    $uibModal.open({
      templateUrl: 'js/views/partials/groupDeleteModal.html',
      controller: 'GroupsDeleteCtrl as groupsDelete',
      resolve: {
        group: () => {
          return vm.group;
        }
      }
    });
  }
}
