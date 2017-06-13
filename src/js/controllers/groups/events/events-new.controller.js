/* globals moment */

angular
.module('stagApp')
.controller('EventsNewCtrl', EventsNewCtrl);

EventsNewCtrl.$inject = ['$stateParams', '$state', 'Event', '$scope', 'Group'];
function EventsNewCtrl($stateParams, $state, Event, $scope, Group){
  const vm = this;
  vm.paramsGroupId = $stateParams.group_id;
  vm.create = eventCreate;

  // We're using angular moment-picker here and setting the minimum and maximum selectable times
  vm.minDateMoment = moment().add(0, 'minute');
  vm.maxDateMoment = moment().add(1, 'year');
  vm.startAfterEnd = false;

  function eventCreate(){
    if (vm.event.end_time < vm.event.start_time) {
      vm.startAfterEnd = true;
      return;
    }
    Event
      .save({ group_id: $stateParams.group_id }, vm.event)
      .$promise
      .then(event => {
        $state.go('groupsShow', { id: vm.paramsGroupId });
      });
  }

  getGroup();

  function getGroup() {
    Group
      .get({ id: $stateParams.group_id })
      .$promise
      .then(group => {
        vm.group = group;
        const endTimesArray = collectEventEndTimes();
        setLastEndTimeAsNewStartTime(endTimesArray);
      });
  }

  function collectEventEndTimes() {
    const endTimesArray = [];
    vm.group.events.forEach(event => {
      endTimesArray.push(new Date(event.end_time));
    });
    return endTimesArray;
  }

  function setLastEndTimeAsNewStartTime(endTimesArray) {
    const lastDate = new Date(Math.max.apply(null, endTimesArray));
    vm.lastEventTime = moment(lastDate);
  }

}
