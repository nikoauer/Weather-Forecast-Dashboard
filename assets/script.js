// API key
var apiKey = "90ba931242e04127d604f04cb6e89a31";

var subtitle = document.getElementById("futureforecast");
subtitle.style.display = "none";
var weatherInformation = document.getElementById("weatherInformation")
weatherInformation.style.display = "none";

// listens for button to begin the fetch request
var search = document.getElementById("search");
search.addEventListener("click", fetchToday);

function fetchToday(event) {
  event.preventDefault();

  // hide today's weather element
  subtitle.style.display = "";
  weatherInformation.style.display = "";

  var userInput = document.getElementById("userInput").value;

  // Fetch the api data
  var weatherURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" + userInput + "&appid=" + apiKey + "&units=metric";
  fetch(weatherURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var previousSearches = localStorage.getItem("lastThreeSearches");
      previousSearches = previousSearches ? JSON.parse(previousSearches) : [];

      // Add the current search value to the array
      previousSearches.push(userInput);

      // Keep only the last three search values
      if (previousSearches.length > 3) {
        previousSearches.shift();
      }

      // Save the updated array in local storage
      localStorage.setItem(
        "lastThreeSearches",
        JSON.stringify(previousSearches)
      );

      displayFetchCallButtons();

      

      // retrieves specific data needed to be displayed
      var name = data.name;
      var icon = data.weather[0].icon;
      var temp = data.main.temp;
      var windspeed = data.wind.speed;
      var humidity = data.main.humidity;

      //new var for icon
      var iconLink = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

      // takes the UNIX time stape and converts it to readable time
      var dateTimestamp = data.dt;
      var date = new Date(dateTimestamp * 1000);
      var formattedDate = date.toDateString();

      // retrieve the id of elements that will display data
      var cityName = document.getElementById("cityName");
      var weatherIcon = document.getElementById("weatherIcon");
      var tempToday = document.getElementById("Temp");
      var windToday = document.getElementById("Wind");
      var humidityToday = document.getElementById("Humidity");

      // append the data content
      cityName.textContent = name + " - " + formattedDate;
      weatherIcon.src = iconLink;
      tempToday.textContent = "Temperature:  " + temp + "°C";
      windToday.textContent = "Wind:  " + windspeed + "KMH";
      humidityToday.textContent = "Humidity:  " + humidity + "%";
    });
  forecastWeather();
}

// function to retrieve future 5 day forecast
function forecastWeather() {
  // clears the page of prior search results
  var forecastDiv = document.getElementById("forecastContainer");
  forecastDiv.innerHTML = "";

  document.getElementById("forecastContainer").style.display = "";

  var userCity = document.getElementById("userInput").value;
  var forecastURL ="https://api.openweathermap.org/data/2.5/forecast?q=" + userCity + "&appid=" + apiKey + "&units=metric";
  fetch(forecastURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var forecastData = data.list;
      var forecastByDate = {};

      // group forecast data by date and 12 PM interval
      forecastData.forEach(function (forecast) {
        var dateTimestamp = forecast.dt;
        var date = new Date(dateTimestamp * 1000);
        var hours = date.getUTCHours();

        // Check if the forecast is for 12 PM and it's not today's date
        if (hours === 12 && !isToday(date)) {
          // get the date to 00:00:00 to compare dates
          date.setUTCHours(0, 0, 0, 0);
          var formattedDate = date.toDateString();

          if (forecastByDate[formattedDate]) {
            forecastByDate[formattedDate].push(forecast);
          } else {
            forecastByDate[formattedDate] = [forecast];
          }
        }
      });

      // display forecast for each day
      for (var date in forecastByDate) {
        var forecastsForDate = forecastByDate[date];

        // create a new div for each date
        var forecastDay = document.createElement("div");
        forecastDay.classList.add("futureForecast");

        // create elements for date and forecasts
        var dateElement = document.createElement("h3");
        dateElement.textContent = date;
        forecastDay.appendChild(dateElement);

        forecastsForDate.forEach(function (forecast) {
          var weatherIcon = forecast.weather[0].icon;
          var temperature = Math.trunc(forecast.main.temp);
          var windSpeed = Math.trunc(forecast.wind.speed);
          var humidity = forecast.main.humidity;

          // create elements for weather icon, temperature, wind, and humidity
          var weatherIconEl = document.createElement("img");
          weatherIconEl.src = "http://openweathermap.org/img/w/" + weatherIcon + ".png";
          forecastDay.appendChild(weatherIconEl);

          var temperatureEl = document.createElement("p");
          temperatureEl.textContent = "Temperature:  " + temperature + "°C";
          forecastDay.appendChild(temperatureEl);

          var windEl = document.createElement("p");
          windEl.textContent = "Wind Speed:  " + windSpeed + "KMH";
          forecastDay.appendChild(windEl);

          var humidityEl = document.createElement("p");
          humidityEl.textContent = "Humidity:  " + humidity + "%";
          forecastDay.appendChild(humidityEl);
        });

        forecastContainer.appendChild(forecastDay);
      }
    });
}

// helper function to check if a given date is today
function isToday(date) {
  var today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

// this function saves the user 3 last inputs
function displayFetchCallButtons() {
  var previousSearches = localStorage.getItem("lastThreeSearches");
  previousSearches = previousSearches ? JSON.parse(previousSearches) : [];

  var containerElement = document.getElementById("historyButtons");
  containerElement.innerHTML = ""; // Clear the container before adding buttons

  previousSearches.forEach(function (fetchCall) {
    // Create a button element
    var buttonElement = document.createElement("button");
    buttonElement.textContent = fetchCall;

    // Add a click event listener to call the fetchBookInfo function with the saved fetch call
    buttonElement.addEventListener("click", function () {
      document.getElementById("userInput").value = fetchCall;
      fetchToday(event);
    });

    // Append the button to the container element
    containerElement.appendChild(buttonElement);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  displayFetchCallButtons();
});

