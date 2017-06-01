angular
.module('stagApp')
.controller('GroupsEditCtrl', GroupsEditCtrl);

GroupsEditCtrl.$inject = ['$stateParams', '$state', 'Group'];
function GroupsEditCtrl($stateParams, $state, Group){
  const vm = this;
  vm.group = Group.get($stateParams);
  console.log(vm.group);
  vm.update = groupUpdate;

  function groupUpdate(){
    Group
    .update({ id: $stateParams.id }, vm.group)
    .$promise
    .then(()=>{
      $state.go('groupsIndex');
    });
  }
}
