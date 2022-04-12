# weather-companion
A traveller's companion for planning trips based on present and future weather conditions


## Introduction 

The Weather Companion is a website that displays both current weather conditions and a 5-day forecast for many locations throughout the world. Users can enter a city name to bring up that city's weather data for a quick and convienient summary useful for many applications, such as planning trips that span muliple cities.

![Screenshot of quiz page.](https://github.com/CommieDog/weather-companion/blob/main/assets/images/readme/weather-companion-screencap.jpg)

A sample deployment of the website is available on [GitHub Pages](https://commiedog.github.io/weather-companion/).


## Table of Contents

* [Description](#description)
* [Features](#features)
* [Technologies Used](#technologies-used)
* [Future Work](#future-work)
* [Author](#author)
* [License](#license)


## Description

The Weather Companion website opens to a simple-looking display with a search panel on the left and space to show the main weather display on the center and right of the screen.

### Search Panel

The search panel invites users to search for an area's weather report by typing in a city name. If this is the user's first time using the Weather Companion on the current device, the city name entry form will be the only widget displayed on the search panel; otherwise the names of previously searched cities will appear below the form. Submitting the city name form or clicking on the name of a previously searched city will send off an API request using AJAX to OpenWeather's geocoding server to try converting the entered city name to latitude and longitude coordinates. If coordinates are sucessfully received, then the Weather Companion sends another API request to OpenWeather, this time for the coordinates' weather conditions and forecast:
```JavaSrcipt
```

### Weather Display

When the weather data is sucessfully loaded into the Weather Companion, the weather display is revealed and populated with data. The top portion displays the current weather conditions for the city area. At the top is a title with the city name, date, and an icon from OpenWeather for an at-a-glance summary of cloud cover and precipitation. Below that are readous for temperature, humidity, wind speed, and a color-coded display of the UV index. the bottom portion is a five-day forecast, starting with the next day. The condensed forecast cards include the forecast date, an icon, and temperature and humidity values.

### Deleting from Search History

As the Weather Compaion is used for different cities, it can build up a large unwanted list of cities that clutter the search panel and make finding wanted cities more difficult. To combat this, the display for each city's name in the search panel includes a delete button on the right end. Users can simply click it to remove the city from the list and make room for other entries.


## Features

* A


## Technologies Used

* A


## Future Work

A


## Author

John Netzel
* [Portfolio](https://commiedog.github.io/my-portfolio/)
* [LinkedIn](https://www.linkedin.com/in/john-netzel-481112129/)
* [GitHub](https://github.com/CommieDog)

## License
&copy; 2022 John Netzel. All Rights Reserved.