angular
.module('stagApp')
.controller('UsersEditCtrl', UsersEditCtrl);

UsersEditCtrl.$inject = ['$stateParams', '$state', 'User'];
function UsersEditCtrl($stateParams, $state, User){
  const vm = this;
  vm.user = User.get($stateParams);
  console.log(vm.user);
  vm.update = userUpdate;

  function userUpdate(){
    User
    .update({ id: $stateParams.id }, vm.user)
    .$promise
    .then(()=>{
      $state.go('dashboard');
    });
  }
}
