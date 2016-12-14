// Captive portal Javascript
// by Stefan Midjich @ Cygate AB
//

var debug = true;

function getUrlParameter(sParam, default_value) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }

    return default_value;
}


// This function ensures the user gets redirect to the correct destination once
// all jobs have succeeded in the portal software.
function do_success() {
    var url = getUrlParameter('url', 'www.google.com');

    // If url does not start with http the window.location redirect
    // won't work. So prefix http to url.
    if (!url.startsWith('http')) {
        url = 'http://'+url;
    }
    console.log('success: '+url);
    $('#error-box').html('<p>If you\'re not automatically redirected open your browser and try any website manually.</p>');
    $('#error-box').show();
    $('#statusDiv').html('');
    $('#approveButton').prop('disabled', false);

    // Redirect user to the url paramter.
    window.location = url;
}


// Show an error to the user
function do_error(message) {
    $('#approveButton').prop('disabled', false);
    $('#statusDiv').html('');

    $('#error-box').show();
    $('#error-box').html('<p>Failed. Reload page and try again or contact support.</p> ');
    if (message) {
        console.log('server: '+message);
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
            var maxRun = plugin_timeout/2;
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
                        console.log('Resolving job: ', job_result);
                        resolve(job_result);
                        clearTimeout(timer);
                        return(true);
                    }

                    if(job_result.is_failed) {
                        console.log('Job failed: ', job_result);
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
    // This is resolve() above.
    Promise.all(promises).then(function(result) {
        var success = true;

        for(var i=0;i<result.length;i++) {
            var r = result[i].result;
            var meta = result[i].meta;
            if (meta.mandatory) {
                if (result[i].is_finished && result[i].is_failed) {
                    do_error(r.error);
                    success = false;
                    break;
                }
            }
        }

        if (success) {
            // This is for Steve...
            // Apple devices don't poll their captiveportal URL,
            // so this is for them. Android devices will do their
            // own polling and close the wifi-portal before this.
            setTimeout(do_success, 30000);
        }

    // This is reject() above.
    }, function(reason) {
        do_error(reason);
    });
}


// Submit the form
$('#approveForm').submit(function (event) {
    var api_url = '/approve';
    event.preventDefault();
    $('#error-box').hide();
    $('#approveButton').prop('disabled', true);
    $('#statusDiv').html('<img src="/static/images/radio.svg" alt="Loading, please wait..." />');

    if ($('#approveCheckbox').is(':checked')) {

        var ajaxReq = $.post(api_url);
        ajaxReq.done(poll_jobs);

        ajaxReq.fail(function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('Request Error: '+ XMLHttpRequest.responseText + ', status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText);
            do_error(XMLHttpRequest.responseText);
        });
    }
});
