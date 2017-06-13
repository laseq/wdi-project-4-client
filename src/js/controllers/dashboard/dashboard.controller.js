angular
  .module('stagApp')
  .controller('DashboardCtrl', DashboardCtrl);

DashboardCtrl.$inject = ['Group', 'User', 'Request', 'Event', 'TokenService', '$uibModal', 'spinnerService'];
function DashboardCtrl(Group, User, Request, Event, TokenService, $uibModal, spinnerService) {
  const vm = this;

  // vm.user = User.get({ id: TokenService.decodeToken().id });
  vm.groups = Group.userGroups();
  vm.getUser = getUser;
  vm.acceptRequest = acceptGroupRequest;
  vm.declineRequest = declineGroupRequest;
  vm.startDate = [];
  vm.endDate = [];
  vm.checkSameDay = checkSameDay;
  vm.attendance = eventAttendance;

  vm.eventStartDate = [];
  vm.eventStartTime = [];
  vm.eventEndTime = [];
  vm.openCalendar = openCalendarModal;

  // getUser();
  getPendingRequests();

  // getUser gets initiated by the spinner at the top of the dashboard.html file
  function getUser() {
    spinnerService.showGroup('usersSpinnerGroup');
    User
      .get({ id: TokenService.decodeToken().id })
      .$promise
      .then(user => {
        vm.user = user;
        checkUserImage();
        filterUpcomingEvents(vm.user.upcoming_events);
        formatDateTimeForUpcomingEvents();
        // setAngularCalendarEvents();
      })
      .finally(() => {
        spinnerService.hideGroup('usersSpinnerGroup');
      });
  }

  function checkUserImage() {
    if (!vm.user.image) vm.user.image = '../images/user-default.png';
  }

  // displayUserGroups();
  //
  // function displayUserGroups() {
  //   Group
  //     .userGroups()
  //     .$promise
  //     .then(groups => {
  //       console.log('user\'s groups:', groups);
  //       vm.groups = groups;
  //     });
  // }

  function filterUpcomingEvents (events) {
    const now = new Date();
    vm.user.upcoming_events = [];
    vm.userAttending = [];
    vm.userNotAttending = [];
    events.forEach(event => {
      if (new Date(event.end_time) > now) {
        vm.user.upcoming_events.push(event);
        checkUserAttending(event);
      }
    });
  }


  function formatDateTimeForUpcomingEvents() {
    for (let i=0; i<vm.user.upcoming_events.length; i++) {
      vm.eventStartDate[i] = moment(vm.user.upcoming_events[i].start_time).format('ddd Do MMM');
      vm.eventStartTime[i] = moment(vm.user.upcoming_events[i].start_time).format('HH.mm');
      vm.eventEndTime[i] = moment(vm.user.upcoming_events[i].end_time).format('HH.mm');
    }

  }

  function getPendingRequests() {
    Request.
      getPendingRequests()
      .$promise
      .then(requests => {
        vm.pending_requests = requests;
      });
  }

  function acceptGroupRequest(requestId) {
    Request
      .update({ id: requestId })
      .$promise
      .then(() => {
        getPendingRequests();
        vm.groups = Group.userGroups();
        getUser();
      });
  }

  function declineGroupRequest(requestId) {
    Request
      .remove({ id: requestId })
      .$promise
      .then(() => {
        getPendingRequests();
      });
  }

  function checkSameDay(events, index) {
    if (events.length) {
      vm.startDate[index] = moment(events[0].start_time).format('Do MMM YY');
      vm.endDate[index] = moment(events[events.length-1].start_time).format('Do MMM YY');
      if (vm.startDate[index] === vm.endDate[index]) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }

  function eventAttendance(theIndex, theEvent, status) {
    const statusObj = {
      'attendance_status': status
    };

    Event
      .attendance({ group_id: theEvent.group.id, id: theEvent.id}, statusObj)
      .$promise
      .then(attendanceStatus => {
        vm.user.upcoming_events[theIndex].members_attending = attendanceStatus.event.members_attending;
        vm.user.upcoming_events[theIndex].members_not_attending = attendanceStatus.event.members_not_attending;
        vm.user.upcoming_events[theIndex].members_pending = attendanceStatus.event.members_pending;
        updateUserAttending(theIndex);
      });
  }



  function checkUserAttending(event) {
    const userAttendingBoolean = event.members_attending.some(function (value) {
      return (value.id === vm.user.id) ? true:false;
    });
    vm.userAttending.push(userAttendingBoolean);

    const userNotAttendingBoolean = event.members_not_attending.some(function (value) {
      return (value.id === vm.user.id) ? true:false;
    });
    vm.userNotAttending.push(userNotAttendingBoolean);
  }

  function updateUserAttending(theIndex) {
    vm.userAttending[theIndex] = vm.user.upcoming_events[theIndex].members_attending.some(function (value) {
      return (value.id === vm.user.id) ? true:false;
    });
    vm.userNotAttending[theIndex] = vm.user.upcoming_events[theIndex].members_not_attending.some(function (value) {
      return (value.id === vm.user.id) ? true:false;
    });
  }

  function openCalendarModal() {
    $uibModal.open({
      templateUrl: 'js/views/partials/dashboardCalendarModal.html',
      controller: 'CalendarCtrl as calendarCtrl',
      size: 'lg',
      resolve: {
        upcomingEvents: () => {
          return vm.user.upcoming_events;
        }
      }
    });
  }

}
