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

    todaysWeather.style.display = "";

    var userInput = document.getElementById("userInput").value;
    
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

function forecastWeather() {

    var userCity = document.getElementById("userInput").value;
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + userCity + "&cnt=5&appid=" + apiKey + "&units=metric";
    fetch(forecastURL)
    .then(function (response) {
        return response.json();
    })
      .then(function (data) {
        var forecastData = data.list;

        forecastData.forEach(function (forecast) {
            var temperature = forecast.main.temp;
            var humidity = forecast.main.humidity;
            var windSpeed = forecast.wind.speed;

            var dateTimestamp = forecast.dt;
            var date = new Date(dateTimestamp * 1000);
            var formattedDate = date.toDateString();

            // Create HTML elements to display forecast data
            var forecastElement = document.createElement("div");
            forecastElement.innerHTML = "<p>Date: " + formattedDate + "</p>" +
                "<p>Temperature: " + temperature + "°C</p>" +
                "<p>Humidity: " + humidity + "%</p>" +
                "<p>Wind Speed: " + windSpeed + "m/s</p>";

            // Append the forecast element to a container in your HTML
            var forecastContainer = document.getElementById("forecastContainer");
            forecastContainer.appendChild(forecastElement);
        });
      })
}