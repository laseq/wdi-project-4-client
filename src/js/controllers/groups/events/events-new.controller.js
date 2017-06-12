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
      console.log('Make sure the start time is before the end time');
      vm.startAfterEnd = true;
      return;
    }
    Event
      .save({ group_id: $stateParams.group_id }, vm.event)
      .$promise
      .then(event => {
        console.log('event:', event);
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
    console.log('endTimesArray:', endTimesArray);
    const lastDate = new Date(Math.max.apply(null, endTimesArray));
    console.log('lastDate:', lastDate);
    vm.lastEventTime = moment(lastDate);
    console.log('vm.lastEventTime:', vm.lastEventTime);
  }


  // $scope.$watch('vm.event.start_time', function (newValue, oldValue) {
  //   console.log('entered watch start_time');
  //   if (vm.event && vm.event.end_time && moment(newValue) > moment(vm.event.end_time)) {
  //     console.log('entered if true');
  //     vm.startAfterEnd = true;
  //   } else {
  //     console.log('entered if false');
  //     vm.startAfterEnd = false;
  //   }
  //   vm.maxEndTime = moment(newValue).add(7, 'day');
  // });

}
