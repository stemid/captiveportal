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

app.controller('RSMainCtrl', function($scope) {

});

