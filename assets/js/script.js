const citySearchHistory = [];
const apiCallUrlBase = "https://api.openweathermap.org/data/2.5/onecall";
const apiCallAppKey = "b712504003eeddbee6d18227b2ef650b";

const citySearchFormEl = $("#city-search-form");
const citySearchInputEl = $("#city-search-input");
const citySearchHistoryEl = $("#city-search-history");
const weatherDisplayEl = $("#weather-current");
const forecastDay1El = $("#forecast-day-1");
const forecastDay2El = $("#forecast-day-2");
const forecastDay3El = $("#forecast-day-3");
const forecastDay4El = $("#forecast-day-4");
const forecastDay5El = $("#forecast-day-5");
const forecastEls = [forecastDay1El, forecastDay2El, forecastDay3El, forecastDay4El, forecastDay5El];

citySearchFormEl.on("submit", function(event)
{
    event.preventDefault(); // default behavior is to reload page

    var cityName = citySearchInputEl.val();
    if(citySearchHistory.indexOf(cityName) === -1) // If city name is not present in search history
    {
        addCityToSearchHistory(cityName);
    }

    var apiCallUrl = apiCallUrlBase + "?lat=61.2&lon=-149.9&exclude=minutely,hourly,alerts&units=imperial&appid=" + apiCallAppKey;
    $.getJSON(apiCallUrl, function(data)
    {
        loadWeatherApiResponse(data);
    });
});

citySearchHistoryEl.on("click", ".delete-icon", function()
{
    var cityName = $(this).siblings(".city-label").text();
    var cityNameIndex = citySearchHistory.indexOf(cityName);
    citySearchHistory.splice(cityNameIndex, 1) // Removes the city name from the search history

    $(this).parents(".card").remove(); // Removes the city card from the HTML document
});

function addCityToSearchHistory(cityName)
{
    citySearchHistory.push(cityName);

    var cityEl = $("<div class='card my-2'>");
    var cityCardBodyEl = $("<div class='card-body row'>");
    cityCardBodyEl.appendTo(cityEl);
    
    var cityNameEl = $("<p class='city-label card-text mb-0 col-11'>");
    cityNameEl.text(cityName);
    cityNameEl.appendTo(cityCardBodyEl);

    var deleteIcon = $("<div class='delete-icon col-1'>");
    deleteIcon.html("<i class='bi bi-x'></i>");
    deleteIcon.appendTo(cityCardBodyEl);

    cityEl.appendTo(citySearchHistoryEl);
}

function loadWeatherApiResponse(response)
{
    console.log(response);
    weatherDisplayEl.find("#weather-date").text(response.current.dt);
    weatherDisplayEl.find("#weather-icon").append(loadWeatherIcon(response.current.weather[0].icon, true));
    weatherDisplayEl.find("#weather-temp").text(response.current.temp);
    weatherDisplayEl.find("#weather-humid").text(response.current.humidity);
    weatherDisplayEl.find("#weather-wind-speed").text(response.current.wind_speed);
    weatherDisplayEl.find("#weather-uv").text(response.current.uvi);

    for (var i = 0; i < forecastEls.length; i++)
    {
        forecastEls[i].find(".forecast-date").text(response.daily[i].dt);
        forecastEls[i].find(".forecast-icon").append(loadWeatherIcon(response.daily[i].weather[0].icon, false));
        forecastEls[i].find(".forecast-temp").text(response.daily[i].temp.day);
        forecastEls[i].find(".forecast-humid").text(response.daily[i].humidity);
    }
}

function loadWeatherIcon(iconCode, isLarge)
{
    const weatherIconBaseUrl = "http://openweathermap.org/img/wn/";
    if(isLarge)
    {
        iconCode += "@2x";
    }
    iconCode += ".png"
    return $("<img>").attr("src", weatherIconBaseUrl + iconCode);
}