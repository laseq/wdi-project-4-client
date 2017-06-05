angular
  .module('stagApp')
  .controller('GroupsShowCtrl', GroupsShowCtrl);

GroupsShowCtrl.$inject = ['$stateParams', 'Group', '$state', '$uibModal'];
function GroupsShowCtrl($stateParams, Group, $state, $uibModal){
  const vm = this;

  // vm.group = Group.get($stateParams);
  // vm.addComment = commentsCreate;
  vm.delete = groupsDelete;
  vm.openInvites = openGroupInvitesModal;
  vm.openPending = openGroupPendingModal;

  groupsShow();

  function groupsShow() {
    Group
      .get($stateParams)
      .$promise
      .then(group => {
        vm.group = group;
        console.log('group:', group);
      });
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
        $state.go('dashboard');
      });
  }

  function openGroupInvitesModal() {
    var groupInvitesModalInstance = $uibModal.open({
      templateUrl: 'js/views/partials/groupJoinRequestModal.html',
      controller: 'GroupsRequestCtrl as groupsRequest',
      size: 'lg',
      resolve: {
        group: () => {
          return vm.group;
        }
      }
    });

    groupInvitesModalInstance
      .result
      .then(passedItem => {
        if (passedItem) {
          // vm.group = passedItem;
          groupsShow();
        }
      });
  }

  function openGroupPendingModal() {
    var groupPendingModalInstance = $uibModal.open({
      templateUrl: 'js/views/partials/groupViewPendingModal.html',
      controller: 'GroupsPendingCtrl as groupsPending',
      size: 'lg',
      resolve: {
        group: () => {
          return vm.group;
        }
      }
    });

    groupPendingModalInstance
      .result
      .then(passedItem => {
        if (passedItem) {
          // vm.group = passedItem;
          groupsShow();
        }
      });
  }
}
