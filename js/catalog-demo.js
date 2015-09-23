// Example to query the catalog and get the total number of scenes in the catalog
document.querySelector('#how-many-scenes').addEventListener('click', function(evt) {
    evt.preventDefault();
    queryCatalog([], function(data, url) {
        document.querySelector("#how-many-scenes-results").textContent = JSON.stringify(data.meta.total);
        $('#how-many-scenes-url').html(url + "\n\n" + JSON.stringify(data.meta));
    });
});

// Example to query the catalog and get the total number of Theia scenes in the catalog
document.querySelector('#how-many-theia-scenes').addEventListener('click', function(evt) {
    evt.preventDefault();
    queryCatalog(['sensor_platform=theia'], function(data, url) {
        document.querySelector("#how-many-theia-scenes-results").textContent = JSON.stringify(data.meta.total);
        $('#how-many-theia-scenes-url').html(url + "\n\n" + JSON.stringify(data.meta));
    });
});

// Example to query the catalog and get the total number of Theia scenes from July
document.querySelector('#how-many-theia-july-scenes').addEventListener('click', function(evt) {
    evt.preventDefault();
    queryCatalog(['sensor_platform=theia', 'acquired_gte=2015-07-01', 'acquired_lte=2015-07-31'], function(data, url) {
        document.querySelector("#how-many-theia-july-scenes-results").textContent = JSON.stringify(data.meta.total);
        $('#how-many-theia-july-scenes-url').html(url + "\n\n" + JSON.stringify(data.meta));
    });
});

// Example to query the catalog and get the total number of low cloud Landsat8 scenes from June
document.querySelector('#how-many-landsat-june-scenes').addEventListener('click', function(evt) {
    evt.preventDefault();
    queryCatalog(['platform=landsat-8', 'acquired_gte=2015-06-01', 'acquired_lte=2015-06-30', 'cloud_coverage_lte=10'], function(data, url) {
        document.querySelector("#how-many-landsat-june-scenes-results").textContent = JSON.stringify(data.meta.total);
        $('#how-many-landsat-june-scenes-url').html(url + "\n\n" + JSON.stringify(data.meta));
    });
});

// Example to query the catalog and get the most recent Theia scene
document.querySelector('#most-recent-theia-scene').addEventListener('click', function(evt) {
    evt.preventDefault();
    queryCatalog(['platform=iss', 'sort=-acquired', 'limit=1'], function(data, url) {
        var timestamp = data.payload[0]['acquired'];
        document.querySelector("#most-recent-theia-scene-results").textContent = moment(timestamp).fromNow();
        $('#most-recent-theia-scene-url').html(url + "\n\n" + JSON.stringify(data.payload[0]));
    });
});

// Example to query the catalog and get the most recent Landsat8 scene
document.querySelector('#most-recent-landsat-scene').addEventListener('click', function(evt) {
    evt.preventDefault();
    queryCatalog(['platform=landsat-8', 'sort=-acquired', 'limit=1'], function(data, url) {
        var timestamp = data.payload[0]['acquired'];
        document.querySelector("#most-recent-landsat-scene-results").textContent = moment(timestamp).fromNow();
        $('#most-recent-landsat-scene-url').html(url + "\n\n" + JSON.stringify(data.payload[0]));
    });
});

// Helper method to query the catalog, given an arbitrary number of parameters
function queryCatalog(query, callback) {

    var apiKey = localStorage.getItem('apiKey');
        apiSecret = localStorage.getItem('apiSecret'),
        url = "https://api.urthecast.com/v1/archive/scenes?api_key=" + apiKey + "&api_secret=" + apiSecret + "&";

    // Iterate over all of the parameters, appending them to the URL
    // Small bug: this appends a trailing & at the end of the URL
    query.forEach(function (item, iterator) {
        console.log(item, iterator);
        url += item + "&";
    });

    $.ajax({
        type: "GET",
        url: url,
        success: function (data) {
            if (callback) callback(data, url);
        }
    });
}
