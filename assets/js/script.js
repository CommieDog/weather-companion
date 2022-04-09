const citySearchFormEl = $("#city-search-form");
const citySearchInputEl = $("#city-search-input");
const citySearchHistoryEl = $("#city-search-history");

citySearchFormEl.on("submit", function(event)
{
    event.preventDefault(); // default behavior is to reload page
    addCityToSearchHistory(citySearchInputEl.val());
});

function addCityToSearchHistory(cityName)
{
    var cityEl = $("<div>");
    
    var cityNameEl = $("<p>");
    cityNameEl.text(cityName);
    cityNameEl.appendTo(cityEl);

    cityEl.appendTo(citySearchHistoryEl);
}
