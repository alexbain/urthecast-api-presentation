// This example gets the ISS' current location
document.querySelector('#iss-current-location').addEventListener('click', function(evt) {
    evt.preventDefault();

    // Create a Leaflet map
    var satTrackerMap = L.map('iss-current-location-results', {
        keyboard: false,
        attributionControl: false
    }).setView([38.7386, -121.7299], 2);

    // Set a Mapbox basemap layer so we have some context on where we are in the world
    var layer = L.tileLayer('http://api.mapbox.com/v4/urthecast2.ipog0aj7/{z}/{x}/{y}.jpg?access_token=pk.eyJ1IjoidXJ0aGVjYXN0MiIsImEiOiJKM1pwMnFZIn0.ReeiMLJtH18oqVeto7KyZw').addTo(satTrackerMap);

    // This helper method makes an API request and returns response + URL
    getLocationOfSatellite('iss', function(data, url) {
        var coordinates = data.payload[0].geometry.coordinates;

        // Create a Leaflet marker w/ the coordinates
        L.marker([coordinates[1], coordinates[0]]).addTo(satTrackerMap);

        // Pan the map to the market so it's visible
        satTrackerMap.panTo([coordinates[1], coordinates[0]]);

        // Print the URL to the page
        $('#iss-current-location-api-request').html(url);
    });
});

// This example gets Landsat8's current location
document.querySelector('#landsat8-current-location').addEventListener('click', function(evt) {
    evt.preventDefault();

    // Create a Leaflet marker w/ the coordinates
    var satTrackerMap = L.map('landsat8-current-location-results', {
        keyboard: false,
        attributionControl: false
    }).setView([38.7386, -121.7299], 2);

    // Set a Mapbox basemap layer so we have some context on where we are in the world
    var layer = L.tileLayer('http://api.mapbox.com/v4/urthecast2.ipog0aj7/{z}/{x}/{y}.jpg?access_token=pk.eyJ1IjoidXJ0aGVjYXN0MiIsImEiOiJKM1pwMnFZIn0.ReeiMLJtH18oqVeto7KyZw').addTo(satTrackerMap);

    // This helper method makes an API request and returns response + URL
    getLocationOfSatellite('landsat-8', function(data, url) {
        var coordinates = data.payload[0].geometry.coordinates;
        // Create a Leaflet marker w/ the coordinates
        L.marker([coordinates[1], coordinates[0]]).addTo(satTrackerMap);

        // Pan the map to the market so it's visible
        satTrackerMap.panTo([coordinates[1], coordinates[0]]);

        // Print the URL to the page
        $('#landsat8-current-location-api-request').html(url);
    });
});

// Get some TLEs (two line element sets) of the ISS
document.querySelector('#iss-tles').addEventListener('click', function(evt) {
    evt.preventDefault();

    getTLEsForSatellite('iss', function(data) {
        $('#iss-tles-result').html(JSON.stringify(data.payload[0]));
    });

});

// Get some TLEs (two line element sets) of Landsat8
document.querySelector('#landsat8-tles').addEventListener('click', function(evt) {
    evt.preventDefault();

    getTLEsForSatellite('landsat-8', function(data) {
        $('#landsat8-tles-result').html(JSON.stringify(data.payload[0]));
    });

});

// Helper method that makes the actual API call required for getting TLEs
function getTLEsForSatellite(satellite, callback) {
    // Expects key and secret to be in local storage, no error handling
    var apiKey = localStorage.getItem('apiKey'),
        apiSecret = localStorage.getItem('apiSecret'),
        // We want the current timestamp. API accepts ISO-8601 datestamps.
        now = moment().toISOString(),
        url = "https://api.urthecast.com/v1/satellite_tracker/satellites/" + satellite + "/tles?api_key=" + apiKey + "&api_secret=" + apiSecret + "&limit=3";

    $.ajax({
        type: "GET",
        url: url,
        success: function(data) {
            console.log(data);
            if (callback) callback(data);
        }
    });
};

// Given an AOI ID, get the next capture opportunity (Forecast), given a sensor, for that AOI
function getNextForecastForAOI(aoiID, sensor, callback) {

    var apiKey = localStorage.getItem('apiKey'),
        apiSecret = localStorage.getItem('apiSecret'),
        now = moment().toISOString(),
        // Quick breakdown of this API request:
        // * Sensor is the sensor you're interseted in - theia, oli-tirs, etc. See docs for accepted sensors
        // * geometry_intersects - this is the geometry parameter with the "_intersects" filter applied to it.
        //                         this ensures that the forecasts returned intersect with our AOI ID
        // * epoch_gte - this ensures that the "epoch" (timestamp of the forecast) is "gte" (greater than or
        //               or equal to) the current moment. So, basically, in the future.
        // * sort - how to sort the results. in this case we're sorting by the epoch of the first orbit point
        // * limit - we only want the *next* forecast, so limit the results returned to 1
        url = "https://api.urthecast.com/v1/satellite_tracker/sensor_platforms/" + sensor + "/forecasts?api_key=" + apiKey + "&api_secret=" + apiSecret + "&geometry_intersects=" + aoiID + "&epoch_gte=" + now + "&sort=first_orbit_point_epoch&limit=1";

    $.ajax({
        type: "GET",
        url: url,
        success: function(data) {
            console.log(data);
            if (callback) callback(data, url);
        }
    });
}

// This helper method will return the current location of the satellite
function getLocationOfSatellite(satellite, callback) {

    var apiKey = localStorage.getItem('apiKey'),
        apiSecret = localStorage.getItem('apiSecret'),
        now = moment().toISOString(),
        // API request breakdown:
        // * satellite is the satellite you're interested in. iss, landsat8, etc. See docs for all accepted satellites
        // * epoch_lte - make sure that the timestamp of the orbit_point is less than or equal to now (in the past)
        // Default sort order is OK here
        url = "https://api.urthecast.com/v1/satellite_tracker/satellites/" + satellite + "/orbit_points?api_key=" + apiKey + "&api_secret=" + apiSecret + "&epoch_lte=" + now;

    $.ajax({
        type: "GET",
        url: url,
        success: function(data) {
            console.log(data);
            if (callback) callback(data, url);
        }
    });
}
