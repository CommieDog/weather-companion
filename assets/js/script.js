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
