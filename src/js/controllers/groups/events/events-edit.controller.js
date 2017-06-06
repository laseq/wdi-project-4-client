angular
.module('stagApp')
.controller('EventsEditCtrl', EventsEditCtrl);

EventsEditCtrl.$inject = ['$stateParams', '$state', 'Event', 'Group', '$uibModal', 'TokenService'];
function EventsEditCtrl($stateParams, $state, Event, Group, $uibModal, TokenService){
  const vm = this;
  vm.userId = TokenService.decodeToken().id;
  // vm.group = Group.get({ id: $stateParams.group_id });
  vm.groupId = $stateParams.group_id;
  vm.event = Event.get({ group_id: $stateParams.group_id, id: $stateParams.id});
  vm.update = eventUpdate;
  vm.delete = eventsDelete;
  vm.openDelete = openDeleteModal;

  function eventUpdate(){
    Event
      .update({ group_id: $stateParams.group_id, id: $stateParams.id }, vm.event)
      .$promise
      .then(()=>{
        $state.go('eventsShow', { group_id: $stateParams.group_id, id: vm.event.id });
      });
  }

  function eventsDelete() {
    Event
      .delete({ group_id: $stateParams.group_id, id: vm.event.id })
      .$promise
      .then(() => {
        $state.go('groupsShow', { id: $stateParams.group_id });
      });
  }

  function openDeleteModal() {
    $uibModal.open({
      templateUrl: 'js/views/partials/events/eventDeleteModal.html',
      controller: 'EventsDeleteCtrl as eventsDelete',
      resolve: {
        event: () => {
          return vm.event;
        },
        groupId: () => {
          return $stateParams.group_id;
        }
      }
    });
  }
}
