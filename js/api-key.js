// Helper method that takes the data entered in the api-key and api-secret
// fields and saves them to localStorage for use throughout this demo
$('#api-key-and-secret-save').on('click', function(evt) {
    var apiKey = $('#api-key').val(),
        apiSecret = $('#api-secret').val();

    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('apiSecret', apiSecret);

    $('#api-key-secret-form').fadeOut(function() {
        $('#api-key-secret-form-success').fadeIn();
    });
});

// On page load, fetch the apiKey and apiSecret stored in localStorage
// This way you don't have to enter your api key and secret every time
$(function() {

    if (localStorage.getItem('apiKey')) {
        $('#api-key').val(localStorage.getItem('apiKey'));
    }

    if (localStorage.getItem('apiSecret')) {
        $('#api-secret').val(localStorage.getItem('apiSecret'));
    }

});
