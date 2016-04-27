// Captive portal Javascript
// by Stefan Midjich
//
//

var debug = true;

// This function ensures the user gets redirect to the correct destination once
// all jobs have succeeded in the portal software.
function do_success() {
    console.log('success: '+window.location);

    // Do something like refresh the window or go to another URL.
    window.location = window.href;
    location.reload(true);
}

// Show an error to the user
function do_error(message) {
    console.log('failure: '+message);

    $('#error-box').show();
    $('#form-row').hide();
    $('#error-box').append('<p>Failed. Reload page and try again or contact support.</p> ');
    if (message) {
        $('#error-box').append('<p>System response: '+message+'</p>');
    }
}

// Poll the returned jobs and ensure they all succeed
function poll_jobs(data) {
    var promises = [];

    if(debug) {
        console.log('Jobs data: ', data);
    }

    // Push promises into array
    for(var job in data) {
        var job_id = data[job].id;
        var api_url = '/job/'+job_id;

        if (debug) {
            console.log('Processing job: ', data[job]);
        }

        promises.push(new Promise(function(resolve, reject) {
            var maxRun = plugin_ttl/2;
            var timesRun = 0;

            // Timer function that polls the API for job results
            var pollJob = function() {
                ajaxReq = $.get(api_url);
                ajaxReq.done(function(getResponse) {
                    // Verify job data
                    var job_result = getResponse;

                    if (debug) {
                        console.log('Job results: ', job_result);
                    }

                    console.log(job_result);
                    if(job_result.is_finished) {
                        console.log('Resolving job: ', job_result.id);
                        resolve(job_result);
                        clearTimeout(timer);
                        return(true);
                    }

                    if(job_result.is_failed) {
                        console.log('Job failed: ', job_result.id);
                        reject(job_result);
                        clearTimeout(timer);
                        return(false);
                    }
                });

                ajaxReq.fail(function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log('Request Error: '+ XMLHttpRequest.responseText + ', status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText);
                    reject(XMLHttpRequest.responseText);
                });

                // Set timeout recursively until a certain threshold is reached
                if (++timesRun == maxRun) {
                    clearTimeout(timer);
                    reject("Job polling timed out");
                    return;
                } else {
                    timer = setTimeout(pollJob, 2000);
                }
            };

            var timer = setTimeout(pollJob, 500);
        }));
    }

    // Run .all() on promises array until all promises resolve
    Promise.all(promises).then(function(result) {
        var success = true;

        for(var i=0;i<result.length;i++) {
            console.log('Job result: ', result[i]);
            var r = result[i].result;
            var m = result[i].meta;
            if (r.failed && m.mandatory) {
                do_error(r.error);
                success = false;
                break;
            }
        }

        if (success) {
            do_success();
        }
    }, function(reason) {
        do_error(reason);
    });
}


var app = angular.module("rsPortalApp", []);

app.config(function($routeProvider) {
    $routeProvider
        .when('/Swedish', {templateUrl: "swedish.html" })
        .when('/English', {templateUrl: "english.html" })
        .otherwise({redirectTo: '/Swedish'});
});

app.controller('RSMainCtrl', function($scope) {
    $(document).ready(function() {
        $('#error-box').hide();
    });

});



// Submit the form
$('#approveForm').submit(function (event) {
    var api_url = '/approve';
    event.preventDefault();

    // Had some issues trying to set a background image on the button, so I'm
    // just replacing it.
    if ($('#approveCheckbox').is(':checked')) {
        $('#approveButton').prop('disabled', true);
        $('#approveButton').val('');
        $('#approveButton').addClass('button-loading');

        $('#approveButtonDiv').replaceWith('<img src="/static/images/radio.svg" alt="Loading, please wait..." />');

        var ajaxReq = $.post(api_url);
        ajaxReq.done(poll_jobs);

        ajaxReq.fail(function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('Request Error: '+ XMLHttpRequest.responseText + ', status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText);
            do_error(XMLHttpRequest.responseText);
        });
    }
});
