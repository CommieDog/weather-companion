const citySearchHistory = [];

const citySearchFormEl = $("#city-search-form");
const citySearchInputEl = $("#city-search-input");
const citySearchHistoryEl = $("#city-search-history");

citySearchFormEl.on("submit", function(event)
{
    event.preventDefault(); // default behavior is to reload page

    var cityName = citySearchInputEl.val();
    if(citySearchHistory.indexOf(cityName) === -1) // If city name is not present in search history
        addCityToSearchHistory(cityName);
});

function addCityToSearchHistory(cityName)
{
    citySearchHistory.push(cityName);

    var cityEl = $("<div>");
    
    var cityNameEl = $("<p>");
    cityNameEl.text(cityName);
    cityNameEl.appendTo(cityEl);

    cityEl.appendTo(citySearchHistoryEl);
}
