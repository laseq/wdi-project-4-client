/* globals moment */

angular
.module('stagApp')
.controller('EventsNewCtrl', EventsNewCtrl);

EventsNewCtrl.$inject = ['$stateParams', '$state', 'Event'];
function EventsNewCtrl($stateParams, $state, Event){
  const vm = this;
  vm.paramsGroupId = $stateParams.group_id;
  vm.create = eventCreate;

  // We're using angular moment-picker here and setting the minimum and maximum selectable times
  vm.minDateMoment = moment().add(0, 'minute');
  vm.maxDateMoment = moment().add(1, 'year');


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
