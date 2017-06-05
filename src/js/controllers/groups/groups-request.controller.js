angular
  .module('stagApp')
  .controller('GroupsRequestCtrl', GroupsRequestCtrl);

GroupsRequestCtrl.$inject = ['group', 'User', 'Request', '$uibModalInstance', '$state'];
function GroupsRequestCtrl(group, User, Request, $uibModalInstance, $state) {

  const vm = this;
  vm.close = closeModal;
  vm.group = group;
  vm.searchForUser = searchForUserByEmail;
  vm.sendRequests = sendGroupJoinRequests;
  vm.usersToInvite = [];
  let massRequest = [];

  function searchForUserByEmail() {
    console.log('vm.currentEmail:', vm.currentEmail);
    // const userObj = {
    //   email: vm.currentEmail
    // };
    // console.log('userObj:', userObj);
    User
      .findByEmail({ email: vm.currentEmail })
      .$promise
      .then(user => {
        vm.usersToInvite.push(user);
        console.log('vm.usersToInvite:', vm.usersToInvite);
        vm.currentEmail = '';
      })
      .catch(err => {
        console.log('User wasn\'t found');
        console.log('error:', err);
      });
  }

  // Put the group_id and the receiver_id in an array of objects called mass_requests

  function sendGroupJoinRequests() {
    vm.usersToInvite.forEach(user => {
      massRequest.push({ group_id: vm.group.id, receiver_id: user.id});
    });
    const massRequestObj = {
      mass_requests: massRequest
    };
    console.log('massRequestObj:', massRequestObj);
    Request
      .sendMassRequest(massRequestObj)
      .$promise
      .then(data => {
        console.log('data:', data);
      })
      .catch(err => {
        console.log('Something went wrong with the mass request');
        console.log('Error:', err);
      });

  }


  function closeModal() {
    $uibModalInstance.close();
  }

}
