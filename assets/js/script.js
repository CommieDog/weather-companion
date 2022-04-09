const citySearchFormEl = $("#city-search-form");
const citySearchInputEl = $("#city-search-input");

citySearchFormEl.on("submit", function(event)
{
    event.preventDefault(); // default behavior is to reload page
    alert(citySearchInputEl.val());
})