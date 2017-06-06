angular
  .module('stagApp')
  .controller('EventsDeleteCtrl', EventsDeleteCtrl);

EventsDeleteCtrl.$inject = ['event', 'groupId', '$uibModalInstance', '$state', 'Event'];
function EventsDeleteCtrl(event, groupId, $uibModalInstance, $state, Event) {

  const vm = this;
  vm.event = event;
  vm.close = closeModal;
  vm.delete = eventsDelete;

  function closeModal() {
    $uibModalInstance.close();
  }

  function eventsDelete() {
    Event
      .remove({ group_id: groupId, id: event.id })
      .$promise
      .then(() => {
        $uibModalInstance.close();
        $state.go('groupsShow', { id: groupId });
      })
      .catch(err => {
        console.log(err);
      });
  }

}
