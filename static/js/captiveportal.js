// Captive portal Javascript
// by Stefan Midjich
//
//

// This function ensures the user gets redirect to the correct destination once
// all jobs have succeeded in the portal software.
function do_success() {
    console.log('success: '+window.location);
    // Do something like refresh the window or go to another URL.
}

// Show an error to the user
function do_error(message) {
    $('#error-row').show();
    $('#form-row').hide();
    $('#error-msg').val('Failed. Reload page and try again or contact support. ');
    if (message) {
        $('#error-msg').append('System response: '+message);
    }
}

// Poll the returned jobs and ensure they all succeed
function poll_jobs(data) {
    var promises = [];

    // Push promises into array
    for(var job in data) {
        var job_id = data[job].id;
        var api_url = '/job/'+job_id;

        promises.push(new Promise(function(resolve, reject) {
            var maxRun = 3;
            var timesRun = 0;

            // Timer function that polls the API for job results
            var pollJob = function() {
                ajaxReq = $.get(api_url);
                ajaxReq.done(function(getResponse) {
                    // Verify job data
                    var job_result = getResponse;
                    if(job_result.is_finished) {
                        resolve(job_result.result);
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
                } else {
                    timer = setTimeout(pollJob, 2000);
                }
            };

            var timer = setTimeout(pollJob, 500);
        }));
    }

    // Run .all() on promises array until all promises resolve
    Promise.all(promises).then(function(result) {
        if(result.failed) {
            do_error(result.error);
        } else {
            do_success();
        }
    }, function(reason) {
        do_error(reason);
    });
}

// Submit the form
$('#approveForm').submit(function (event) {
    var api_url = '/approve';
    event.preventDefault();

    // Had some issues trying to set a background image on the button.
    if ($('#approveCheckbox').is(':checked')) {
        $('#approveButton').prop('disabled', true);
        $('#approveButton').val('');
        $('#approveButton').addClass('button-loading');

        $('#approveButtonDiv').replaceWith('<img src="/static/images/radio.svg" alt="Loading, please wait..." />');

        var ajaxReq = $.post(api_url);
        ajaxReq.done(poll_jobs);

        ajaxReq.fail(function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('Request Error: '+ XMLHttpRequest.responseText + ', status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText);
        });
    }
});
