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

citySearchHistoryEl.on("click", ".delete-icon", function()
{
    var cityName = $(this).siblings(".city-label").text();
    var cityNameIndex = citySearchHistory.indexOf(cityName);
    citySearchHistory.splice(cityNameIndex, 1) // Removes the city name from the search history

    $(this).parent().remove(); // Removes the city card from the HTML document
});

function addCityToSearchHistory(cityName)
{
    citySearchHistory.push(cityName);

    var cityEl = $("<div>");
    
    var cityNameEl = $("<p class='city-label'>");
    cityNameEl.text(cityName);
    cityNameEl.appendTo(cityEl);

    var deleteIcon = $("<div class='delete-icon'>");
    deleteIcon.html("<i class='bi bi-x'></i>");
    deleteIcon.appendTo(cityEl);

    cityEl.appendTo(citySearchHistoryEl);
}
