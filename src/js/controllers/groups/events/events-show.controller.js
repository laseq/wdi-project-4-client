angular
.module('stagApp')
.controller('EventsShowCtrl', EventsShowCtrl);

EventsShowCtrl.$inject = ['$stateParams', '$state', 'Group', 'Event', 'TokenService', '$uibModal', 'User'];
function EventsShowCtrl($stateParams, $state, Group, Event, TokenService, $uibModal, User){
  const vm = this;
  vm.userId = TokenService.decodeToken().id;
  vm.paramsGroupId = $stateParams.group_id;
  // vm.group = Group.get({ id: $stateParams.group_id });
  // vm.event = Event.get({ group_id: $stateParams.group_id, id: $stateParams.id});
  vm.attendance = eventAttendance;
  vm.openMemberCardModal = openMemberCardModal;

  getEvent();
  getGroup();

  function getEvent() {
    Event
      .get({ group_id: $stateParams.group_id, id: $stateParams.id})
      .$promise
      .then(event => {
        console.log('event:', event);
        vm.event = event;
        setEventTimeStatus();
        checkCurrentMemberAttendingEvent();
      });
  }

  function getGroup() {
    Group
      .get({ id: $stateParams.group_id })
      .$promise
      .then(group => {
        console.log('group:', group);
        vm.group = group;
      });
  }

  function eventAttendance(status) {
    console.log('status:', status);
    const statusObj = {
      'attendance_status': status
    };

    Event
      .attendance({ group_id: $stateParams.group_id, id: $stateParams.id}, statusObj)
      .$promise
      .then(attendanceStatus => {
        console.log('attendanceStatus:', attendanceStatus);
        // getEvent();
        vm.event.members_attending = attendanceStatus.event.members_attending;
        vm.event.members_not_attending = attendanceStatus.event.members_not_attending;
        vm.event.members_pending = attendanceStatus.event.members_pending;
        checkCurrentMemberAttendingEvent();
      });
  }

  function setEventTimeStatus() {
    const now = new Date();
    const startTime = new Date(vm.event.start_time);
    const endTime = new Date(vm.event.end_time);
    if (startTime > now) {
      vm.event.status = 'upcoming';
    } else if (startTime <= now && endTime >= now) {
      vm.event.status = 'now';
    } else {
      vm.event.status = 'ended';
    }
  } // End of function setEventTimeStatus

  function checkCurrentMemberAttendingEvent() {
    console.log('entered checkCurrentMemberAttendingEvent');
    vm.currentUserAttending = vm.event.members_attending.some(function (value) {
      return (value.id === vm.userId) ? true:false;
    });
    vm.currentUserNotAttending = vm.event.members_not_attending.some(function (value) {
      return (value.id === vm.userId) ? true:false;
    });
  }

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
