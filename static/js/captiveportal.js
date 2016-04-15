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

        ajaxReq.done(function(data) {
            console.log(data);
        });

        ajaxReq.fail(function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('Request Error: '+ XMLHttpRequest.responseText + ', status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText)
        });
    }
});
