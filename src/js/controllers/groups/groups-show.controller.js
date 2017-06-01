angular
  .module('stagApp')
  .controller('GroupsShowCtrl', GroupsShowCtrl);

GroupsShowCtrl.$inject = ['$stateParams', 'Group', '$state'];
function GroupsShowCtrl($stateParams, Group, $state){
  const vm = this;
  // vm.addComment = commentsCreate;
  vm.delete = groupsDelete;

  groupsShow();

  function groupsShow() {
    vm.group = Group.get($stateParams);
  }

  // function commentsCreate() {
  //   vm.comment.group_id = vm.group.id;
  //   vm.comment.user_id = 1;
  //   Comment
  //     .save(vm.comment)
  //     .$promise
  //     .then(data => {
  //       groupsShow();
  //       console.log(vm.comment);
  //       vm.comment = {};
  //       console.log('data:', data);
  //     });
  // }

  function groupsDelete() {
    Group
      .delete({ id: vm.group.id })
      .$promise
      .then(() => {

        $state.go('groupsIndex');
      });
  }
}
