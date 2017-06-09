angular
.module('stagApp')
.controller('EventsShowCtrl', EventsShowCtrl);

EventsShowCtrl.$inject = ['$stateParams', '$state', 'Group', 'Event', 'TokenService', '$uibModal'];
function EventsShowCtrl($stateParams, $state, Group, Event, TokenService, $uibModal){
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
        getEvent();
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
