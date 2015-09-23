// This example creates an Area of Interest
document.querySelector('#create-sf-aoi').addEventListener('click', function(evt) {
    evt.preventDefault();
    var data = $('#sf-aoi').html();

    // createAOI callback will receive data and URL and print to screen
    createAOI(data, function(data, url) {
        var name = data.payload[0]['name'],
            id = data.payload[0]['id'];

        // Set the ID and name in localStorage for easy use in later demos
        localStorage.setItem('sf-aoi-id', id);
        localStorage.setItem('sf-aoi-name', name);

        document.querySelector("#create-sf-aoi-response-name").textContent = name;
        document.querySelector("#create-sf-aoi-response-id").textContent = id;
        document.querySelector("#create-sf-aoi-response-url").textContent = url + "\n\n" + JSON.stringify(data);
    });
});

// This examples queries the Archive/Catalog, restricting by AOI ID
document.querySelector('#catalog-filter-aoi').addEventListener('click', function(evt) {
    evt.preventDefault();

    // Expects AOi to have been created
    var aoiId = localStorage.getItem('sf-aoi-id');

    // Query the catalog, including the geometry parameter w/ intersects filter
    // This will ensure all scenes returned intersect with the AOI ID provided
    queryCatalog(['geometry_intersects=' + aoiId], function(data, url) {
        document.querySelector("#catalog-filter-aoi-response").textContent = data.meta.total;
        document.querySelector("#catalog-filter-aoi-url").textContent = url + "\n\n" + JSON.stringify(data.meta);
    });
});

// Get the next Forecast (capture opportunity) for the Theia sensor for our AOI
document.querySelector('#sat-tracker-forecast-aoi').addEventListener('click', function(evt) {
    evt.preventDefault();

    // Expects AOI to have been created - no error handling
    var aoiID = localStorage.getItem('sf-aoi-id');

    // method is in sat-tracker-demo.js
    getNextForecastForAOI(aoiID, 'theia', function(data, url) {
        var next = data.payload[0]['first_orbit_point_epoch'];

        document.querySelector("#sat-tracker-forecast-aoi-response").textContent = moment(next).fromNow();
        document.querySelector("#sat-tracker-forecast-aoi-url").textContent = url;
    });
});

// Get the next Forecast (capture opportunity) for the oli-tirs sensor (Landsat 8) for our AOI ID
document.querySelector('#sat-tracker-forecast-aoi-landsat').addEventListener('click', function(evt) {
    evt.preventDefault();

    // Expects AOi to have been created - no error handling
    var aoiID = localStorage.getItem('sf-aoi-id');

    // method is in sat-tracker-demo.js
    getNextForecastForAOI(aoiID, 'oli-tirs', function(data, url) {
        var next = data.payload[0]['first_orbit_point_epoch'];
        document.querySelector("#sat-tracker-forecast-aoi-response-landsat").textContent = moment(next).fromNow();
        document.querySelector("#sat-tracker-forecast-aoi-url-landsat").textContent = url + "\n\n" + JSON.stringify(data);
    });
});

// Helper method that actually makes the API request to create an AOI
function createAOI(data, callback) {
    var apiKey = localStorage.getItem('apiKey');
        apiSecret = localStorage.getItem('apiSecret'),
        url = "https://api.urthecast.com/v1/consumers/apps/me/aois?api_key=" + apiKey + "&api_secret=" + apiSecret + "&";

    $.ajax({
        type: "POST",
        url: url,
        contentType: 'application/json',
        data: data,
        success: function (data) {
            console.log(data);
            if (callback) callback(data, url);
        }
    });
}
