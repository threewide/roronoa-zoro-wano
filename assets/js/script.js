var APIKey = "b8e1c5d59c784ffde744bb2d758039a4"
var searchButton = document.getElementById('search-btn');
var savedCitiesButton = document.getElementById('saved-cities');
var fiveDayForecastContainer = document.getElementById('#five-day-forecast');
var cityInput = $('.city-input');
var cityLat;
var cityLon;

// main search button
searchButton.addEventListener('click', function () {

    saveCity(cityInput.val());

    getCityLatLon(cityInput.val());

    createCityList();
})

// added search buttons
savedCitiesButton.addEventListener('click', function (event) {
    getCityLatLon(event.target.textContent);
})

function getCityLatLon(city) {
    var cityToLatLonUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + 
                            city + '&appid=' + APIKey;

    fetch(cityToLatLonUrl)
        .then(function(response) {
            console.log(response);
            return response.json();
        })
        .then(function(locationData) {
            cityLat = locationData.coord.lat;
            cityLon = locationData.coord.lon;
            getApi();
        });
}

function getApi() {
    var requestUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + 
                    cityLat + '&lon=' + cityLon + 
                    '&exclude=minutely,hourly&units=metric&limit=5&appid=' 
                    + APIKey;
    fetch(requestUrl)
        .then(function(response) {
            console.log(response);
            return response.json();
        })
        .then(function(data) {
            // document.getElementById('location-name-date').append(data.name);
            document.getElementById('temp-label').textContent = 'Temp: ';
            document.getElementById('wind-label').textContent = 'Wind: ';
            document.getElementById('humidity-label').textContent = 'Humidity';
            document.getElementById('uv-index-label').textContent = 'UV Index';

            document.getElementById('temp-label').append(data.current.temp);
            document.getElementById('wind-label').append(data.current.wind_speed);
            document.getElementById('humidity-label').append(data.current.humidity);
            document.getElementById('uv-index-label').append(data.current.uvi);
            console.log(data);
            fiveDayForecast(data);
        });
}

function fiveDayForecast(data) {

    let fiveDayForecastHTML = `
    <h2>5-Day Forecast:</h2>
    <div id="fiveDayForecast">`;
    
    for (let i = 0; i < 5; i++) {
        let iconURL = "https://openweathermap.org/img/w/" 
                    + data.daily[i].weather[0].icon + ".png";
        
        fiveDayForecastHTML += `
            <div class="card">
                <ul>
                    <li><img src="${iconURL}"></li>
                    <li>Temp: ${data.daily[i].temp.day}&#8457;</li>
                    <br>
                    <li>Wind: ${data.daily[i].wind_speed}MPH</li>
                    <br>
                    <li>Humidity: ${data.daily[i].humidity}%</li>
                </ul>
            </div>`;
    }

    fiveDayForecastHTML += `</div>`;

    $('#five-day-forecast').html(fiveDayForecastHTML)
}

var saveCity = function (city) {
    // loop through saved cityList and compare city. if the new city matches
    // a city in local storage it is not added to the list
    var isNewCity = true; 
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.getItem('cityList' + i) === city) {
            isNewCity = false;
            break;
        }
    }
    if (isNewCity === true){
        localStorage.setItem('cityList' + localStorage.length, city);
    }
}

var createCityList = function() {
    $('#saved-cities').empty();
    if (localStorage.length > 0) {
        let savedCitiesEl;
        for (let i = 0; i < localStorage.length; i++) {
            savedCitiesEl += '<button type="submit" class="btn">' + 
            localStorage.getItem('cityList' + i) + '</button>';
        }

        $('#saved-cities').prepend(savedCitiesEl);
    }
}

createCityList();