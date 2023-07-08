var apiKey = "90ba931242e04127d604f04cb6e89a31";

// listens for button to begin the fetch request 
var search =  document.getElementById("search");
search.addEventListener("click", fetchSearch);

// this hides the today weather card holder 
var todaysWeather = document.getElementById("todaysWeather");
todaysWeather.style.display = "none";

function fetchSearch(event){
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
};