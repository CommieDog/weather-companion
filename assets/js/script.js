const citySearchHistory = [];
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

citySearchHistoryEl.on("click", ".btn-close", function(event)
{
    var cityName = $(this).parent().text();
    var cityNameIndex = citySearchHistory.indexOf(cityName);
    citySearchHistory.splice(cityNameIndex, 1) // Removes the city name from the search history
    $(this).parent().remove(); // Removes the city name from the HTML document

    event.stopPropagation(); // Makes sure that the handler listening for city selection doesn't fire too!
});

function addCityToSearchHistory(cityName)
{
    citySearchHistory.push(cityName);

    var cityEl = $("<li class='list-group-item'>");
    cityEl.text(cityName);
    cityEl.attr("id", cityName);

    var deleteIcon = $("<button class='btn-close float-end'>");
    deleteIcon.appendTo(cityEl);

    cityEl.appendTo(citySearchHistoryEl);
}

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
    alert(foundCityName + " should be active!");
    $("#" + foundCityName).addClass("active");
}

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

function convertUnixTimestampToDate(timestamp)
{
    return moment.unix(timestamp).format("M/DD/YYYY");
}