// Captive portal Javascript
// by Stefan Midjich
//
//

var debug = true;
var app = angular.module("rsPortalApp", []);

app.config(function($routeProvider) {
    $routeProvider
        .when('/Swedish', {templateUrl: "swedish.html" })
        .when('/English', {templateUrl: "english.html" })
        .when('/FAQ-Swedish', {templateUrl: "faq-swe.html" })
        .otherwise({redirectTo: '/Swedish'});
});

app.controller('RSMainCtrl', function($scope, $http) {
    $scope.approved = {};

    $scope.submit = function() {
        if ($scope.approved.answer == true) {
            $http({
                method: 'POST',
                url: '/approve',
            }).then(function success(response) {
                poll_jobs(response.data);
            }, function error(response) {
                // Failure
                console.log(response);
            });
        }
    };

});

