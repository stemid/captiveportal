// Captive portal Javascript
// by Stefan Midjich
//
//

var app = angular.module("rsPortalApp", []);

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

app.controller('RSMainCtrl', function($scope, $http, $q, config) {
    $scope.approved = {};
    $scope.apiProcessing = false;
    $scope.apiErrors = [];

    function poll_jobs(job_id) {
        var defer = $q.defer();
        var api_url = '/job/'+job_id;

        // TODO: Restore maxRun before going live.
        var maxRun = plugin_timeout/10;
        var timesRun = 0;

        var do_poll = function () {
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
                clearTimeout(timer);
                if (config.debug) {
                    console.log('Polling timed out');
                }
                defer.reject("Job polling timed out");
                return;
            } else {
                timer = setTimeout(do_poll, 2000);
            }

        };

        var timer = setTimeout(do_poll, 500);
    }

    $scope.submit = function() {
        $scope.apiProcessing = true;
        console.log('hej');
        var promises = [];

        if ($scope.approved.answer == true) {
            $http({
                method: 'POST',
                url: '/approve',
            }).then(function success(response) {
                if (config.debug) {
                    console.log('/approve => '+response);
                }
                for (var job in response.data) {
                    var job_id = response.data[job].id;
                    var promise = poll_jobs(job_id);
                    promises.push(promise);
                }

                $q.all(promises).then(function (response) {
                    if (config.debug) {
                        console.log('Resolved: '+response);
                    }
                    $scope.apiProcessing = false;
                }, function (reason) {
                    if (config.debug) {
                        console.log(reason);
                    }
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

