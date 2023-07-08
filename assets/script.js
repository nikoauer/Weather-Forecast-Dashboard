// API key 
var apiKey = "90ba931242e04127d604f04cb6e89a31";

// users input 


// listens for button to begin the fetch request 
var search =  document.getElementById("search");
search.addEventListener("click", fetchToday);

// this hides the today weather card holder 
var todaysWeather = document.getElementById("todaysWeather");
todaysWeather.style.display = "none";

function fetchToday(event){
    event.preventDefault();

    // hide today's weather element 
    todaysWeather.style.display = "";

    var userInput = document.getElementById("userInput").value;
    
    // Fetch the api data 
    var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userInput + "&appid=" + apiKey + "&units=metric"
    fetch(weatherURL)
    .then(function (response) {
        return response.json();
    })
      .then(function (data) {
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
      })
      forecastWeather();
};

// function retrieve future 5 day forecast
function forecastWeather() {

    // clears the page of prior serach results
    var forecastDiv = document.getElementById("forecastContainer");
    forecastDiv.innerHTML = "";

    document.getElementById("forecastContainer").style.display = "";

    var userCity = document.getElementById("userInput").value;
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + userCity + "&appid=" + apiKey + "&units=metric";
    fetch(forecastURL)
    .then(function (response) {
        return response.json();
    })
      .then(function (data) {
        var forecastData = data.list;
            var forecastByDate = {};

            // group forecast data by date
            forecastData.forEach(function (forecast) {
                var dateTimestamp = forecast.dt;
                var date = new Date(dateTimestamp * 1000);
                // get the time to 00:00:00 to compare dates
                date.setHours(0, 0, 0, 0);
                var formattedDate = date.toDateString();

                if (forecastByDate[formattedDate]) {
                    forecastByDate[formattedDate].push(forecast);
                } else {
                    forecastByDate[formattedDate] = [forecast];
                }
            });

            // display forecast for each day
            for (var date in forecastByDate) {
                var forecastsForDate = forecastByDate[date];

                // create a new div for each date
                var forecastDay = document.createElement("div");

                // create elements for date and forecasts
                var dateElement = document.createElement("h3");
                dateElement.textContent = date;
                forecastDay.appendChild(dateElement);

                // calculate average values for each forecast property added across the 3 hour intervals
                var temperatureSum = 0;
                var humiditySum = 0;
                var windSpeedSum = 0;

                forecastsForDate.forEach(function (forecast) {
                    temperatureSum += forecast.main.temp;
                    humiditySum += forecast.main.humidity;
                    windSpeedSum += forecast.wind.speed;
                });

                // truncate variables to remove decimal points
                var temperatureAvg = Math.trunc(temperatureSum / forecastsForDate.length);
                var humidityAvg = Math.trunc(humiditySum / forecastsForDate.length);
                var windSpeedAvg = Math.trunc(windSpeedSum / forecastsForDate.length);

                // create elements for average temperature, humidity, and wind
                var temperatureElement = document.createElement("p");
                temperatureElement.textContent = "Temperature:  " + temperatureAvg + "°C";
                forecastDay.appendChild(temperatureElement);

                var windElement = document.createElement("p");
                windElement.textContent = "Wind Speed:  " + windSpeedAvg + "KMH";
                forecastDay.appendChild(windElement);

                var humidityElement = document.createElement("p");
                humidityElement.textContent = "Humidity:  " + humidityAvg + "%";
                forecastDay.appendChild(humidityElement);

                // append the forecast element to the container in your HTML
                var forecastContainer = document.getElementById("forecastContainer");
                forecastContainer.appendChild(forecastDay);
        }
      });
}