angular
.module('stagApp')
.controller('EventsEditCtrl', EventsEditCtrl);

EventsEditCtrl.$inject = ['$stateParams', '$state', 'Event', '$uibModal'];
function EventsEditCtrl($stateParams, $state, Event, $uibModal){
  const vm = this;
  // vm.group = Group.get($stateParams);
  // vm.event = Event.get($stateParams.id);
  // vm.update = eventUpdate;
  // vm.delete = eventsDelete;
  // vm.openDelete = openDeleteModal;

  // function eventUpdate(){
  //   Event
  //     .update({ id: $stateParams.id }, vm.event)
  //     .$promise
  //     .then(()=>{
  //       $state.go('eventsShow', { id: vm.event.id });
  //     });
  // }
  //
  // function eventsDelete() {
  //   Event
  //     .delete({ id: vm.event.id })
  //     .$promise
  //     .then(() => {
  //       $state.go('groupsShow({ id: $stateParams.group_id })');
  //     });
  // }
  //
  // function openDeleteModal() {
  //   $uibModal.open({
  //     templateUrl: 'js/views/partials/events/eventDeleteModal.html',
  //     controller: 'EventsDeleteCtrl as eventsDelete',
  //     resolve: {
  //       group: () => {
  //         return vm.event;
  //       }
  //     }
  //   });
  // }
}
