angular
.module('stagApp')
.controller('EventsShowCtrl', EventsShowCtrl);

EventsShowCtrl.$inject = ['$stateParams', '$state', 'Group', 'Event'];
function EventsShowCtrl($stateParams, $state, Group, Event){
  const vm = this;
  vm.paramsGroupId = $stateParams.group_id;
  vm.group = Group.get({ id: $stateParams.group_id });
  vm.event = Event.get({ group_id: $stateParams.group_id, id: $stateParams.id});

  

}
