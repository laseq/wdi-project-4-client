angular
.module('stagApp')
.controller('GroupsEditCtrl', GroupsEditCtrl);

GroupsEditCtrl.$inject = ['$stateParams', '$state', 'Group', '$uibModal', 'group'];
function GroupsEditCtrl($stateParams, $state, Group, $uibModal, group){
  const vm = this;

  // group is passed in from the router.config.js file because of the security screening through the router file
  vm.group = group;
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
