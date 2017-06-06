angular
.module('stagApp')
.controller('EventsNewCtrl', EventsNewCtrl);

EventsNewCtrl.$inject = ['$stateParams', '$state', 'Event'];
function EventsNewCtrl($stateParams, $state, Event){
  const vm = this;
  vm.paramsGroupId = $stateParams.group_id;
  vm.create = eventCreate;

  function eventCreate(){
    Event
      .save({ group_id: $stateParams.group_id }, vm.event)
      .$promise
      .then(event => {
        console.log('event:', event);
        $state.go('groupsShow', { id: vm.paramsGroupId });
      });
  }
}
