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
    controller: 'GroupsEditCtrl as vm',
    resolve: {
      group: secureGroupEdit
    }
  })
  // .state('groupsEdit', {
  //   url: '/groups/:id/edit',
  //   templateUrl: 'js/views/groups/edit.html',
  //   controller: 'GroupsEditCtrl as vm',
  //   resolve: {
  //     group: function(Group, TokenService, $stateParams, $state) {
  //       return Group.get($stateParams)
  //       .$promise
  //       .then(group => {
  //         if (group.creator_id !== TokenService.decodeToken().id) {
  //           return $state.go('groupsShow', { id: group.id });
  //         } else {
  //           return group;
  //         }
  //       }, error => {
  //         console.log('error:', error);
  //       });
  //     }
  //   }
  // })
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

secureGroupEdit.$inject = ['Group', 'TokenService', '$stateParams', '$state'];
function secureGroupEdit(Group, TokenService, $stateParams, $state) {
  return Group.get($stateParams)
  .$promise
  .then(group => {
    if (group.creator_id !== TokenService.decodeToken().id) {
      return $state.go('groupsShow', { id: group.id });
    } else {
      return group;
    }
  }, error => {
    console.log('error:', error);
  });
}
