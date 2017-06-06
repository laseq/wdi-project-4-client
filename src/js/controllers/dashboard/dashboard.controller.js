angular
  .module('stagApp')
  .controller('DashboardCtrl', DashboardCtrl);

DashboardCtrl.$inject = ['Group', 'User', 'Request', 'TokenService'];
function DashboardCtrl(Group, User, Request, TokenService) {
  const vm = this;

  // vm.user = User.get({ id: TokenService.decodeToken().id });
  vm.groups = Group.userGroups();
  vm.acceptRequest = acceptGroupRequest;
  vm.declineRequest = declineGroupRequest;
  vm.startDate = [];
  vm.endDate = [];
  vm.checkSameDay = checkSameDay;

  getUser();
  getPendingRequests();

  // Just using this verbose function to see the console log for vm.user
  function getUser() {
    User
      .get({ id: TokenService.decodeToken().id })
      .$promise
      .then(user => {
        vm.user = user;
        console.log('user:', user);
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

  function getPendingRequests() {
    Request.
      getPendingRequests()
      .$promise
      .then(requests => {
        vm.pending_requests = requests;
        console.log('pending requests:', requests);
      });
  }

  function acceptGroupRequest(requestId) {
    Request
      .update({ id: requestId })
      .$promise
      .then(() => {
        getPendingRequests();
        vm.groups = Group.userGroups();
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
      vm.startDate[index] = new Date(events[0].start_time).toDateString();
      vm.endDate[index] = new Date(events[events.length-1].start_time).toDateString();
      console.log('vm.startDate[index]:', vm.startDate[index]);
      console.log('vm.endDate[index]:', vm.endDate[index]);
      if (vm.startDate[index] === vm.endDate[index]) {
        console.log('true');
        return true;
      } else {
        console.log('false');
        return false;
      }
    }
    return false;
  }

}
