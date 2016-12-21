// Captive portal Javascript
// by Stefan Midjich
//
//

var app = angular.module("rsPortalApp", ['ngRoute']);

app.constant('config', {
    debug: true
});

app.config(function($routeProvider, $interpolateProvider) {

    $routeProvider
        .when('/Swedish', {templateUrl: "swedish.html" })
        .when('/English', {templateUrl: "english.html" })
        .when('/FAQ-Swedish', {templateUrl: "faq-swe.html" })
        .otherwise({redirectTo: '/Swedish'});

    $interpolateProvider.startSymbol('[%');
    $interpolateProvider.endSymbol('%]');
});

app.controller('RSMainCtrl', function($scope, $http, $q, $location, $timeout, config) {

    $scope.approved = {};
    $scope.apiProcessing = false;
    var params = $location.search();

    if (params.url === undefined) {
        $scope.redir_url = 'http://www.google.com';
    } else {
        if (params.url.startsWith('http')) {
            $scope.redir_url = params.url;
        } else {
            $scope.redir_url = 'http://'+params.url;
        }
    }

    function do_success() {
        console.log($scope.redir_url);
        angular.element(document.location = $scope.redir_url)
    }

    function poll_job(job_id) {
        var defer = $q.defer();
        var api_url = '/job/'+job_id;

        var maxRun = plugin_timeout/2;
        var timesRun = 0;

        setTimeout(function () {
            $http.get(api_url).success(function(data) {
                if (config.debug) {
                    console.log(data);
                }

                if (data.is_finished) {
                    if (config.debug) {
                        console.log('Resolving job: '+job_id);
                    }
                    defer.resolve(job_id, data.result);
                }

                if (data.is_failed) {
                    console.log('Job failed: '+job_id);
                    defer.reject(job_id, data.result);
                }
            });
            // TODO: Add fail callback to log failed GET API requests.

            console.log('Runs: '+timesRun+'/'+maxRun);
            if (++timesRun == maxRun) {
                if (config.debug) {
                    console.log('Polling timed out');
                }
                defer.reject("Job polling timed out");
            }

        }, 1000);

        return defer.promise;
    }

    $scope.submit = function() {
        $scope.apiProcessing = true;
        var promises = [];
        $scope.apiErrors = [];

        if ($scope.approved.answer == true) {
            $http({
                method: 'POST',
                url: '/approve',
            }).then(function success(response) {
                for (var job in response.data) {
                    var job_id = response.data[job].id;
                    var promise = poll_job(job_id);
                    promises.push(promise);
                }

                $q.all(promises).then(function (job_id, response) {
                    $scope.apiProcessing = false;
                    console.log('Success');
                    // Do success redirect
                    $timeout(do_success, 30000);
                }, function (job_id, reason) {
                    $scope.apiErrors.push('Job '+job_id+' failed: '+reason);
                    $scope.apiProcessing = false;
                });

            }, function error(response) {
                // Failure
                if (config.debug) {
                    console.log(response);
                }
                $scope.apiErrors.push(response);
                $scope.apiProcessing = false;
            });
        }
    };

});

