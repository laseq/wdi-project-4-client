angular
  .module('stagApp')
  .config(Router);

Router.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
function Router($stateProvider, $urlRouterProvider, $locationProvider) {

  $locationProvider.html5Mode(true);

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: '/js/views/home.html'
    })
    .state('register', {
      url: '/register',
      templateUrl: '/js/views/register.html',
      controller: 'RegisterCtrl as register'
    })
    .state('login', {
      url: '/login',
      templateUrl: '/js/views/login.html',
      controller: 'LoginCtrl as login'
    })
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: '/js/views/dashboard.html',
      controller: 'DashboardCtrl as vm'
    })
    .state('groupsIndex', {
      url: '/groups',
      templateUrl: '/js/views/groups/index.html',
      controller: 'GroupsIndexCtrl as vm'
    })
    .state('groupsShow', {
      url: '/groups/:id',
      templateUrl: 'js/views/groups/show.html',
      controller: 'GroupsShowCtrl as vm'
    })
    .state('groupsNew', {
      url: '/groups/new',
      templateUrl: '/js/views/groups/new.html',
      controller: 'GroupsNewCtrl as vm'
    })
    .state('groupsEdit', {
      url: '/groups/:id/edit',
      templateUrl: 'js/views/groups/edit.html',
      controller: 'GroupsEditCtrl as vm'
    })
    .state('usersEdit', {
      url: '/users/:id/edit',
      templateUrl: 'js/views/users/edit.html',
      controller: 'UsersEditCtrl as vm'
    })
    .state('eventsShow', {
      url: '/groups/:group_id/events/:id',
      templateUrl: 'js/views/groups/events/show.html',
      controller: 'EventsShowCtrl as vm'
    })
    .state('eventsNew', {
      url: '/groups/:group_id/events/new',
      templateUrl: '/js/views/groups/events/new.html',
      controller: 'EventsNewCtrl as vm'
    })
    .state('eventsEdit', {
      url: '/groups/:group_id/events/:id/edit',
      templateUrl: 'js/views/groups/events/edit.html',
      controller: 'EventsEditCtrl as vm'
    });

  $urlRouterProvider.otherwise('/');
}
