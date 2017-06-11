/* globals moment */

angular
  .module('stagApp')
  .controller('CalendarCtrl', CalendarCtrl);

CalendarCtrl.$inject = ['upcomingEvents', '$uibModalInstance', '$state'];
function CalendarCtrl(upcomingEvents, $uibModalInstance, $state) {
  const vm = this;

  vm.close = closeModal;
  vm.upcomingEvents = upcomingEvents;
  vm.calendarView = 'month';

  vm.viewDate = (vm.upcomingEvents.length) ? new Date(vm.upcomingEvents[0].start_time) : new Date();
  // vm.viewDate = moment(vm.upcomingEvents[0].start_date).toDate();

  setAngularCalendarEvents();

  function setAngularCalendarEvents() {

    const calendarEventsArray = [];

    vm.upcomingEvents.forEach(event => {
      const eventObj = {
        title: event.name,
        startsAt: new Date(event.start_time),
        endsAt: new Date(event.end_time),
        color: { // can also be calendarConfig.colorTypes.warning for shortcuts to the deprecated event types
          primary: '#e3bc08', // the primary event color (should be darker than secondary)
          secondary: '#fdf1ba' // the secondary event color (should be lighter than primary)
        }
      };
      calendarEventsArray.push(eventObj);
    });

    vm.events = calendarEventsArray;

  } // End of setAngularCalendarEvents

  function closeModal() {
    $uibModalInstance.close();
  }
}
