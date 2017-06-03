angular
.module('stagApp')
.controller('GroupsNewCtrl', GroupsNewCtrl);

GroupsNewCtrl.$inject = ['$state', 'Group'];
function GroupsNewCtrl($state, Group){
  const vm = this;
  vm.create = groupCreate;

  function groupCreate(){
    Group
      .save(vm.group)
      .$promise
      .then(()=>{
        $state.go('dashboard');
      });
  }
}
