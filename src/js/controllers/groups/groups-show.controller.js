angular
  .module('stagApp')
  .controller('GroupsShowCtrl', GroupsShowCtrl);

GroupsShowCtrl.$inject = ['$stateParams', 'Group', 'User', 'Event', '$state', '$uibModal', 'TokenService'];
function GroupsShowCtrl($stateParams, Group, User, Event, $state, $uibModal, TokenService){
  const vm = this;
  vm.user = User.get({ id: TokenService.decodeToken().id });

  // vm.group = Group.get($stateParams);
  // vm.addComment = commentsCreate;
  vm.delete = groupsDelete;
  vm.openInvites = openGroupInvitesModal;
  vm.openPending = openGroupPendingModal;
  vm.openDeleteMembers = openDeleteMembersModal;
  vm.openMemberCardModal = openMemberCardModal;

  // The variables below are for the agenda date selector
  vm.dateStringArray = [];
  vm.dateStringPosition = 0;
  vm.decrementDate = decrementDate;
  vm.incrementDate = incrementDate;
  vm.attendance = eventAttendance;

  initGroupsShow();

  function initGroupsShow() {
    Group
      .get($stateParams)
      .$promise
      .then(group => {
        vm.group = group;
        console.log('group:', group);
        setEventTimeStatus(group);
        putDateStringsInArray();
        getCurrentDateString();
      });
  }

  function groupsShow() {
    Group.get($stateParams)
      .$promise
      .then(group => {
        vm.group = group;
        console.log('group:', group);
      });
  }

  function updateMemberAttendingCount(theIndex, theDate, theEvent) {
    Group.get($stateParams)
      .$promise
      .then(group => {
        vm.group.events_by_date[theDate][theIndex].members_attending = group.events_by_date[theDate][theIndex].members_attending;
        vm.group.events_by_date[theDate][theIndex].members_not_attending = group.events_by_date[theDate][theIndex].members_not_attending;
        vm.group.events_by_date[theDate][theIndex].members_pending = group.events_by_date[theDate][theIndex].members_pending;
      });
  }

  function setEventTimeStatus(theGroup) {
    const now = new Date();

    // The original version when I was iterating over the events property
    // instead of the events_by_date property
    // theGroup.events.forEach(event => {
    //   const startTime = new Date(event.start_time);
    //   const endTime = new Date(event.end_time);
    //   if (startTime > now) {
    //     event.status = 'upcoming';
    //   } else if (startTime <= now && endTime >= now) {
    //     event.status = 'now';
    //   } else {
    //     event.status = 'ended';
    //   }
    // });

    for (var date in theGroup.events_by_date) {
      if (theGroup.events_by_date.hasOwnProperty(date)) {
        for (let i=0; i<theGroup.events_by_date[date].length; i++) {
          const startTime = new Date(theGroup.events_by_date[date][i].start_time);
          const endTime = new Date(theGroup.events_by_date[date][i].end_time);
          if (startTime > now) {
            theGroup.events_by_date[date][i].status = 'upcoming';
          } else if (startTime <= now && endTime >= now) {
            theGroup.events_by_date[date][i].status = 'now';
          } else {
            theGroup.events_by_date[date][i].status = 'ended';
          }
        }
      }
    }
  } // End of function setEventTimeStatus

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

  function eventAttendance(theIndex, theDate, theEvent, status) {
    // console.log('status:', status);
    const statusObj = {
      'attendance_status': status
    };
    // console.log('theEvent:', theEvent);

    Event
      .attendance({ group_id: $stateParams.id, id: theEvent.id}, statusObj)
      .$promise
      .then(attendanceStatus => {
        console.log('attendanceStatus:', attendanceStatus);
        // updateMemberAttendingCount(theIndex, theDate, theEvent);
        vm.group.events_by_date[theDate][theIndex].members_attending = attendanceStatus.event.members_attending;
        vm.group.events_by_date[theDate][theIndex].members_not_attending = attendanceStatus.event.members_not_attending;
        vm.group.events_by_date[theDate][theIndex].members_pending = attendanceStatus.event.members_pending;
      });
  }

  function putDateStringsInArray() {
    Object.keys(vm.group.events_by_date).forEach(function(key, index) {
      vm.dateStringArray.push(key);
    });
  }

  function getCurrentDateString() {
    vm.currentDateString = vm.dateStringArray[vm.dateStringPosition];
  }

  function incrementDate() {
    if (vm.dateStringPosition < vm.dateStringArray.length-1) {
      vm.dateStringPosition += 1;
      getCurrentDateString();
    }
  }

  function decrementDate() {
    if (vm.dateStringPosition > 0) {
      vm.dateStringPosition -= 1;
      getCurrentDateString();
    }
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
  } // End of openGroupInvitesModal

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
  } // End of openGroupPendingModal

  function openDeleteMembersModal() {
    var groupDeleteMembersInstance = $uibModal.open({
      templateUrl: 'js/views/partials/groupDeleteMembersModal.html',
      controller: 'GroupsDeleteMembersCtrl as groupsDeleteMembers',
      size: 'lg',
      resolve: {
        group: () => {
          return vm.group;
        }
      }
    });

    groupDeleteMembersInstance
    .result
    .then(passedItem => {
      if (passedItem) {
        // vm.group = passedItem;
        groupsShow();
      }
    });
  } // End of openDeleteMembersModal

  function openMemberCardModal(theMember) {
    $uibModal.open({
      templateUrl: 'js/views/partials/group-members/memberCardModal.html',
      controller: 'MemberCardCtrl as memberCard',
      size: 'sm',
      resolve: {
        member: () => {
          return theMember;
        }
      }
    });
  }


}
