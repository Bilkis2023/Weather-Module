// let weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherApiKey}`; 
// var geoapi=`http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=${weatherApiKey}`
let weatherApiKey = '08c3565d78414f9134bafaeed4808aa7';
https://api.openweathermap.org/data/2.5/forecast?q=London,uk&APPID=08c3565d78414f9134bafaeed4808aa7


var searchForm = document.getElementById("search-form")
var searchInput = $("#search-input")
var cityName = document.getElementById("cityname")
var searchBtn = document.getElementById("search-button")
var historyContainer = document.getElementById("history")
var todayContainer = document.getElementById("today")
var forecastContainer = document.getElementById("forecast")
var historyBtn = []
// let newList = document.createElement("ul");
// let newItem = document.createElement("li");
let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];


let date = dayjs().format('D/M/YYYY');



// var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
// var historyBtn = []
//  historyBtn.push(search)
//  localStorage.setItem("searchHistory",'historyBtn');
function saveSearchHistory(newSearch) {
    // searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    // save to localstorage
    searchHistory.push(newSearch);

    window.localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    displayHistory()
}


function displayHistory() {
    let newList = document.createElement("ul");
    // let newItem = document.createElement("li");
    historyContainer.innerHTML = ''
    for (let i = 0; i < searchHistory.length; i++) {
        let newItem = document.createElement("li");
        newItem.innerText = searchHistory[i];
        newList.append(newItem);

        // add a click event listener to each history item
        newItem.addEventListener('click', function () {
            searchCity(null, searchHistory[i]);
        });
    }

    historyContainer.append(newList);


}

function getHistory() {
    var storedHistory = localStorage.getItem("searchHistory")
    if (storedHistory) {
        searchHistory = JSON.parse(storedHistory)

    }
    displayHistory()
}
// newItem.innerText = historyBtn[0]
// console.log(searchHistory)



searchBtn.addEventListener("click", searchCity)
//taking input for the city and validating
function searchCity(e, cityName = null) {
    try {
        if (e) e.preventDefault()
        var search = cityName ? cityName : searchInput.val().trim()
        console.log(search)
        geoSearch(search)
        if (!cityName) saveSearchHistory(search);
    } catch (error) {
        console.log(error)
    }
}
function geoSearch(search) {
    console.log(search)
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=${weatherApiKey}`)
        // Test the official documentation at: http://api.openweathermap.org
        // Identify which API endpoint to fetch the data from
        // For weather we can use this endpoint/url below:
        //fetch(`http://api.openweathermap.org/data/2.5/weather?units=metric&q=${search}&appid=${weatherApiKey}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // Console log the data object and then use dot notation to log the data we need
            // Such as Temp, Humidity, Pressure, etc
            console.log(data)

            weatherSearch(data[0])
        })
}

function weatherSearch(location) {
    console.log(location)
    var { lat, lon } = location;
    console.log(lat, lon);
    var city = location.name;
    console.log(city);

    let weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`;

    fetch(weatherApiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            displayCurrent(data.list[0], city)
            var forecastarray = [data.list[7], data.list[14], data.list[21], data.list[28], data.list[35]]
            displayForecast(forecastarray, city)
            // console.log("Temp: ", data.main.temp)
            // console.log("feels_like", data.main.feels_like)
            //     console.log("Humidity ", data.main.humidity)
            //     console.log("Pressure ", data.main.pressure)
            // 

        })
}




function displayCurrent(current, city) {
    console.log("current", current);
    // Set the values as a variable
    var temp = current.main.temp
    var feels_like = current.main.feels_like
    var humidity = current.main.humidity
    var wind = current.wind.speed
    // var icon = current.weather[0].icon
    var iconDescription = current.weather[0].main
    var iconUrl = `https:openweathermap.org/img/w/${current.weather[0].icon}.png`
    
    // var date = current.dt_txt



    //     // Select the main card text element by id
    //     // We will set the id 'main-card-text' in index.html
    //     var mainCardText = document.getElementById('main-card-text')
    //     // We will then use text content to set the current temp
    //     mainCardText.textContent= `Current temp: ${currentTemp}`

    //creating the card elements
    var card = document.createElement('div')
    var cardBody = document.createElement('div')
    var cardTitle = document.createElement('h5')
    var cardTextTemp = document.createElement('p')
    var cardTextFeelsLike = document.createElement('p')
    var cardTextHumidity = document.createElement('p')
    var cardTextWind = document.createElement('p')
    var iconImg = document.createElement('img')


    //set classes to the elements
    card.setAttribute("class", 'card card-current')
    cardBody.setAttribute('class', 'card-body')
    card.append(cardBody)

    cardTitle.setAttribute('class', 'card-title')
    cardTextTemp.setAttribute('class', 'card-text')
    cardTextFeelsLike.setAttribute('class', 'card-text')
    cardTextHumidity.setAttribute('class', 'card-text')
    cardTextWind.setAttribute('class', 'card-text')

    iconImg.setAttribute('class', 'weather-img')
    iconImg.setAttribute('src', iconUrl)
    iconImg.setAttribute('alt', iconDescription)

    //start adding data and img to card
    cardTitle.textContent = `${city} (${date})`;
    cardTitle.append(iconImg)

    cardTextTemp.textContent = `Temp:  ${temp}\u00B0C `
    cardTextFeelsLike.textContent = `Feels_Like: ${feels_like}`
    cardTextHumidity.textContent = `Humidity:  ${humidity}`
    cardTextWind.textContent = `Wind:  ${wind}`

    //combine data w/card - build
    cardBody.append(cardTitle, cardTextTemp, cardTextFeelsLike, cardTextHumidity, cardTextWind)
    todayContainer.append(card)
}




//solving for 5 days -- display the title for 5-day Forecast, then process the array of days
function displayForecast(forecast, city) {
    console.log(forecast);

    forecastContainer.textContent = '5-day Forecast'
    forecastContainer.innerHTML = ""
    //loop thru the array of forecast (data.list), create a card for each day.  Solve for 5 days
    for (let i = 0; i < forecast.length; i++) {
        const current = forecast[i];
        console.log(current);


        console.log(current);
        // Set the values as a variable
        var temp = current.main.temp
        var feels_like = current.main.feels_like
        var humidity = current.main.humidity
        var wind = current.wind.speed
        // var icon = current.weather[0].icon
        var iconDescription = current.weather[0].main
        var iconUrl = `https:openweathermap.org/img/w/${current.weather[0].icon}.png`
        // var cpressure = data.main.pressure
        // var date = current.dt_txt

        //     // Select the main card text element by id
        //     // We will set the id 'main-card-text' in index.html
        //     var mainCardText = document.getElementById('main-card-text')
        //     // We will then use text content to set the current temp
        //     mainCardText.textContent= `Current temp: ${currentTemp}`

        //creating the card elements
        var card = document.createElement('div')
        var cardBody = document.createElement('div')
        var cardTitle = document.createElement('h5')
        var cardTextTemp = document.createElement('p')
        var cardTextFeelslike = document.createElement('p')
        var cardTextHumidity = document.createElement('p')
        var cardTextWind = document.createElement('p')
        var iconImg = document.createElement('img')


        //set classes to the elements
        card.setAttribute("class", 'card column')
        cardBody.setAttribute('class', 'card-body')
        card.append(cardBody)

        cardTitle.setAttribute('class', 'card-title')
        cardTextTemp.setAttribute('class', 'card-text')
        cardTextFeelslike.setAttribute('class', 'feels_like')
        cardTextHumidity.setAttribute('class', 'card-text')
        cardTextWind.setAttribute('class', 'card-text')

        iconImg.setAttribute('class', 'weather-img')
        iconImg.setAttribute('src', iconUrl)
        iconImg.setAttribute('alt', iconDescription)

        //start adding data and img to card
        cardTitle.textContent = `${city} (${date})`;
        cardTitle.append(iconImg)

        cardTextTemp.textContent = `Temp:  ${temp}\u00B0C `
        cardTextFeelslike.textContent = `Feels_like: ${feels_like}`
        cardTextHumidity.textContent = `Humidity:  ${humidity}`
        cardTextWind.textContent = `Wind:  ${wind}`

        //combine data w/card - build
        cardBody.append(cardTitle, cardTextTemp, cardTextFeelslike, cardTextHumidity, cardTextWind)
        forecastContainer.append(card)

    }




}

historyContainer.addEventListener("click",function(event){
console.log (event.target)
})


displayHistory()