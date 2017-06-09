angular
  .module('stagApp')
  .controller('DashboardCtrl', DashboardCtrl);

DashboardCtrl.$inject = ['Group', 'User', 'Request', 'Event', 'TokenService'];
function DashboardCtrl(Group, User, Request, Event, TokenService) {
  const vm = this;

  // vm.user = User.get({ id: TokenService.decodeToken().id });
  vm.groups = Group.userGroups();
  vm.acceptRequest = acceptGroupRequest;
  vm.declineRequest = declineGroupRequest;
  vm.startDate = [];
  vm.endDate = [];
  vm.checkSameDay = checkSameDay;
  vm.attendance = eventAttendance;


  vm.eventStartDate = [];
  vm.eventStartTime = [];
  vm.eventEndTime = [];

  getUser();
  getPendingRequests();

  // Just using this verbose function to see the console log for vm.user
  function getUser() {
    User
      .get({ id: TokenService.decodeToken().id })
      .$promise
      .then(user => {
        vm.user = user;
        filterUpcomingEvents(vm.user.upcoming_events);
        console.log('user:', vm.user);
        formatDateTimeForUpcomingEvents();
      });
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
    events.forEach(event => {
      if (new Date(event.end_time) > now) {
        vm.user.upcoming_events.push(event);
      }
    });
  }

  function formatDateTimeForUpcomingEvents() {
    // if (event.length) {
    //   vm.startDate[index] = moment(events[0].start_time).format('Do MMM YY');
    //   vm.endDate[index] = moment(events[events.length-1].start_time).format('Do MMM YY');
    //   if (vm.startDate[index] === vm.endDate[index]) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }
    // return true;

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
        // console.log('pending requests:', requests);
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
    // console.log('status:', status);
    const statusObj = {
      'attendance_status': status
    };
    // console.log('theEvent:', theEvent);

    Event
      .attendance({ group_id: theEvent.group.id, id: theEvent.id}, statusObj)
      .$promise
      .then(attendanceStatus => {
        // console.log('attendanceStatus:', attendanceStatus);
        updateMemberAttendingCount(theIndex, theEvent);
      });
  }

  function updateMemberAttendingCount(theIndex, theEvent) {
    User.get({ id: vm.user.id })
      .$promise
      .then(user => {
        console.log('user.upcoming_events:', user.upcoming_events);
        var index = user.upcoming_events.map(function(element) {
          return element.id;
        }).indexOf(theEvent.id);
        vm.user.upcoming_events[theIndex].members_attending = user.upcoming_events[index].members_attending;
        vm.user.upcoming_events[theIndex].members_not_attending = user.upcoming_events[index].members_not_attending;
        vm.user.upcoming_events[theIndex].members_pending = user.upcoming_events[index].members_pending;
      });
  }

}
