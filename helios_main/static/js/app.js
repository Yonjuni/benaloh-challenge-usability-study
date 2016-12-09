'use strict';

var heliosStudyMainApp = angular.module(
    "heliosStudy",
    [
        "ngAnimate",
        "ngRoute",
        "localization",
        "BackendService"
    ]
).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.
        // when('/:id', {templateUrl: '/selectionTask/static/partials/introduction.html', controller: 'introductionCtrl'}).
        // when('/task/:id', {templateUrl: '/selectionTask/static/partials/task.html', controller: 'taskCtrl'}).
        // when('/thanks/:id', {templateUrl: '/selectionTask/static/partials/thanks.html', controller: 'thanksCtrl'}).
        // when('/error/:id/:error', {templateUrl: '/selectionTask/static/partials/error.html', controller: 'errorCtrl'}).
        // otherwise({templateUrl: '/selectionTask/static/partials/introduction.html', controller: 'introductionCtrl'});
    // use the HTML5 History API
    $locationProvider.html5Mode(true).hashPrefix('!');
}]);

heliosStudyMainApp.run(function ($rootScope, $window, $document, localize) {
    // root scope functions
    $rootScope.getLanguages = function () {
        return ['en', 'jp'];
    };
    $rootScope.$watch('language', function (newLang) {
        localize.setLanguage(newLang);
        $rootScope.$broadcast('langChange', newLang);
    });
    // initialization
    if (!$rootScope.language) {
        $rootScope.language = $window.navigator.userLanguage ||
                              $window.navigator.language ||
                              $document.getElementsByTagName('html')[0].lang;
        if ($rootScope.language && ($rootScope.language.length > 2)) {
            $rootScope.language = $rootScope.language.substr(0, 2);
        }
        //If hard coding a language is desired, do it here, if not delete the following line
        $rootScope.language = "jp";
    }
});