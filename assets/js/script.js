const citySearchHistory = JSON.parse(localStorage.getItem("WeatherCompanionHistory")) || []; // Load search history from local storage if present, else start empty
const apiCallGeocodingUrlBase = "http://api.openweathermap.org/geo/1.0/direct";
const apiCallWeatherUrlBase = "https://api.openweathermap.org/data/2.5/onecall";
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

/**
 * Initialize page
 */
function init()
{
    // Create HTML from search history
    for (const cityName of citySearchHistory)
    {
        addCityToSearchHistoryHtml(cityName);
    }
}

/**
 * When city search form is submitted, add city name to history and query for weather data
 */
citySearchFormEl.on("submit", function(event)
{
    event.preventDefault(); // default behavior is to reload page

    var cityName = citySearchInputEl.val();

    var geocodingUrl = apiCallGeocodingUrlBase + "?q=" + cityName + "&limit=1&appid=" + apiCallAppKey;
    $.getJSON(geocodingUrl, function(data)
    {
        data = data[0];
        if(!data)
        {
            alert("City not found!");
            return;
        }
        var cityName = data.name;
        if(citySearchHistory.indexOf(cityName) === -1) // If city name is not present in search history
        {
            addCityToSearchHistory(cityName);
        }
        var weatherUrl = apiCallWeatherUrlBase + "?lat=" + data.lat +"&lon=" + data.lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + apiCallAppKey;
        $.getJSON(weatherUrl, function(data)
        {
            loadWeatherApiResponse(data, cityName);
        });
    });
});

/**
 * When city search history entry is clicked, query for that city's weather data
 */
citySearchHistoryEl.on("click", "li", function()
{
    var cityName = $(this).text();
    var geocodingUrl = apiCallGeocodingUrlBase + "?q=" + cityName + "&limit=1&appid=" + apiCallAppKey;
    $.getJSON(geocodingUrl, function(data)
    {
        data = data[0];
        if(!data)
        {
            alert("City not found!");
            return;
        }
        var cityName = data.name;
        var weatherUrl = apiCallWeatherUrlBase + "?lat=" + data.lat +"&lon=" + data.lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + apiCallAppKey;
        $.getJSON(weatherUrl, function(data)
        {
            loadWeatherApiResponse(data, cityName);
        });
    });
});

/**
 * When city search history entry's delete button is clicked, remove that city from history list
 */
citySearchHistoryEl.on("click", ".btn-close", function(event)
{
    var cityName = $(this).parent().text();
    removeCityFromSearchHistory(cityName);

    event.stopPropagation(); // Makes sure that the handler listening for city selection doesn't fire too!
});

/**
 * Adds a city name to the site's search history
 * @param {*} cityName The name of the city to add
 */
function addCityToSearchHistory(cityName)
{
    citySearchHistory.push(cityName);
    localStorage.setItem("WeatherCompanionHistory" , JSON.stringify(citySearchHistory))
    addCityToSearchHistoryHtml(cityName);
}

/**
 * Adds a city name to the site's search history HTML display
 * @param {*} cityName The name of the city to add
 */
function addCityToSearchHistoryHtml(cityName)
{
    var cityEl = $("<li class='list-group-item'>");
    cityEl.text(cityName);
    cityEl.attr("id", cityName);

    var deleteIcon = $("<button class='btn-close float-end'>");
    deleteIcon.appendTo(cityEl);

    cityEl.appendTo(citySearchHistoryEl);
}

/**
 * Removes a city name from the site's search history
 * @param {*} cityName The name of the city to remove
 */
function removeCityFromSearchHistory(cityName)
{
    var cityNameIndex = citySearchHistory.indexOf(cityName);
    citySearchHistory.splice(cityNameIndex, 1) // Removes the city name from the search history
    localStorage.setItem("WeatherCompanionHistory" , JSON.stringify(citySearchHistory))
    $("#" + cityName).remove(); // Removes the city name from the HTML document
}

/**
 * Loads a response from the API into the site's weather display
 * @param {*} response The server's API response
 * @param {*} foundCityName The name of the city used to query the weather data
 */
function loadWeatherApiResponse(response, foundCityName)
{
    console.log(response);
    weatherDisplayEl.find("#weather-city-name").text(foundCityName); // City name is never received from the server; it must be stored and retrieved locally
    weatherDisplayEl.find("#weather-date").text("(" + convertUnixTimestampToDate(response.current.dt) + ")");
    weatherDisplayEl.find("#weather-icon").attr("src", getWeatherIconUrl(response.current.weather[0].icon, true));
    weatherDisplayEl.find("#weather-temp").text(response.current.temp);
    weatherDisplayEl.find("#weather-humid").text(response.current.humidity);
    weatherDisplayEl.find("#weather-wind-speed").text(response.current.wind_speed);
    weatherDisplayEl.find("#weather-uv").text(response.current.uvi);
    applyUVIndexStyling(weatherDisplayEl.find("#weather-uv"), response.current.uvi);

    for (var i = 0; i < forecastEls.length; i++)
    {
        forecastEls[i].find(".forecast-date").text(convertUnixTimestampToDate(response.daily[i + 1].dt));
        forecastEls[i].find(".forecast-icon").attr("src", getWeatherIconUrl(response.daily[i + 1].weather[0].icon, false));
        forecastEls[i].find(".forecast-temp").text(response.daily[i + 1].temp.day);
        forecastEls[i].find(".forecast-humid").text(response.daily[i + 1].humidity);
    }

    $("#city-search-history li").removeClass("active");
    $("#" + foundCityName).addClass("active");
    $(".invisible").removeClass("invisible"); // Show weather display
}

/**
 * Assembles the URL of a weather state's icon from its icon code in the API response
 * @param {*} iconCode The API code of the icon to display
 * @param {*} isLarge Whether to use the large form of an icon or the small form
 * @returns The URL to the requested icon
 */
function getWeatherIconUrl(iconCode, isLarge)
{
    iconCode = "http://openweathermap.org/img/wn/" + iconCode;
    if(isLarge)
    {
        iconCode += "@2x";
    }
    iconCode += ".png"
    return iconCode;
}

/**
 * Applies styling to the UV Index display based on its value
 * @param {*} uvIndexEl The element to style
 * @param {*} uvIndex the UV Index value
 */
function applyUVIndexStyling(uvIndexEl, uvIndex)
{
    uvIndex = Math.round(uvIndex);
    var uvIndexStyle = "uv ";
    if(uvIndex >= 11)
    {
        uvIndexStyle += "uv-extreme";
    }
    else if(uvIndex >= 8)
    {
        uvIndexStyle += "uv-very-high";
    }
    else if(uvIndex >= 6)
    {
        uvIndexStyle += "uv-high";
    }
    else if(uvIndex >= 3)
    {
        uvIndexStyle += "uv-medium";
    }
    else
    {
        uvIndexStyle += "uv-low";
    }
    uvIndexEl.addClass(uvIndexStyle);
}

/**
 * Converts a Unix timestamp into a formatted date
 * @param {*} timestamp The Unix timestamp value
 * @returns A formatted date string
 */
function convertUnixTimestampToDate(timestamp)
{
    return moment.unix(timestamp).format("M/DD/YYYY");
}

init();
