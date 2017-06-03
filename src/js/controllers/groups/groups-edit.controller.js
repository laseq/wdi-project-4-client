angular
.module('stagApp')
.controller('GroupsEditCtrl', GroupsEditCtrl);

GroupsEditCtrl.$inject = ['$stateParams', '$state', 'Group'];
function GroupsEditCtrl($stateParams, $state, Group){
  const vm = this;
  vm.group = Group.get($stateParams);
  vm.update = groupUpdate;

  function groupUpdate(){
    Group
    .update({ id: $stateParams.id }, vm.group)
    .$promise
    .then(()=>{
      $state.go('groupsShow', { id: vm.group.id });
    });
  }
}
