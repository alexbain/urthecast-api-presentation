// Get the most recent events for a given AOI
document.querySelector('#event-stream-aoi').addEventListener('click', function(evt) {
    evt.preventDefault();
    var aoiID = localStorage.getItem('sf-aoi-id');

    getEventsForAoi(aoiID, function(data, url) {
        var result = "";
        data.payload.forEach(function (item, i) {
            result += item.stream + " " + item.data.scene_id + " " + item.created + "\n";
        });
        document.querySelector("#event-stream-aoi-results").textContent = url + "\n\n" + result;
    });
});

  // Get he most recent events for all of UC platform
document.querySelector('#event-stream').addEventListener('click', function(evt) {
    evt.preventDefault();

    getEventsForAoi(null, function(data, url) {
        var result = "";

        data.payload.forEach(function (item, i) {
            result += item.stream + " " + item.data.scene_id + " " + item.created + "\n";
        });

        document.querySelector("#event-stream-results").textContent = url + "\n\n" + result;
    });
});

// Helper method to make API requests to the Event Stream API
function getEventsForAoi(aoiID, callback) {

    var apiKey = localStorage.getItem('apiKey');
        apiSecret = localStorage.getItem('apiSecret'),
        url = "https://api.urthecast.com/v1/event_streams/events?api_key=" + apiKey + "&api_secret=" + apiSecret + "&limit=5";

    // If an aoiID is included, append it to the URL
    if (aoiID !== null) {
        url += "&geometry_intersects=" + aoiID;
    }

    $.ajax({
        type: "GET",
        url: url,
        success: function (data) {
            if (callback) callback(data, url);
        }
    });

};
