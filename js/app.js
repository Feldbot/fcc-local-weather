var output = $("#locale");
var errorMsg = $("#error");
var latitude, longitude;

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getPosition, showError);
    console.log(navigator.geolocation);
  } else {
    output.html("Geolocation is not supported by this browser.");
  }
}

function getPosition(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;

  getWeather(latitude, longitude);
}

function showError(error) {
  output.html('&nbsp;');
  switch (error.code) {
    case error.PERMISSION_DENIED:
      errorMsg.html("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      output.html("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      output.html("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      output.html("An unknown error occurred.");
      break;
  }
}

function getWeather() {
  $.ajax({
    url: "https://fcc-weather-api.glitch.me/api/current?",
    format: "json",
    method: "GET",
    data: {
      lon: longitude,
      lat: latitude
    },
    success: function(response) {
      var tempC = Math.floor(response.main.temp);
      var tempF = Math.floor(tempC * 1.8) + 32;
      var description = response.weather[0].description;

      $("#locale").html(response.name);

      $("#icon").html("<img src=" + response.weather[0].icon + ">");

      $("#temperature").html("<h3>The temperature is "+ tempC + "&deg;C with " + description + "</h3>");

      $("#button").html("<button id='toggleTemp' onclick='this.blur()'>toggle &deg;F/&deg;C</button>");

      toggleTemp(tempC, tempF, description);

      console.log(response);
    }
  });
}

function toggleTemp(tempC, tempF, description) {
  var tempInC = true;

  $("#toggleTemp").on("click", function() {
    if (tempInC) {
      $("#temperature").html("<h3>The temperature is " + tempF + "&deg;F with " + description + "</h3>");
      tempInC = false;
    } else {
      $("#temperature").html("<h3>The temperature is " + tempC + "&deg;C with " + description +"</h3>");
      tempInC = true;
    }
  });
}

getLocation();

/***** NOTES *****
Fahrenheit to Celsius conversions:
C to F: Multiply by 1.8 (or 9/5) and add 32.
F to C: Subtract 32 and multiply by .5556 (or 5/9).

jQuery.param() can be used to construct query string:
 http://www.tothenew.com/blog/jquery-create-url-query-string-from-jsonarray/
*/
