const weather = []
const searchedList = JSON.parse(localStorage.getItem('cities')) || []
const weatherData = JSON.parse(localStorage.getItem('data')) || []
const daysArray = [0,6,14,22,30,38]


function parseData(data) {
        console.log(data)
        const dataParsed = []
        const city = data.city.name
        console.log('ava')
        const cityData = []
        daysArray.forEach((day) => {
        const today = data.list[day]
        // const todaysDate = today[dt];
        const todayTemp = convertKelvinToFarenheit(today.main.temp)
        const todayWind = today.wind.speed
        const todayHumidity = today.main.humidity
        cityData.push({'temp':todayTemp , 'wind': todayWind, 'humidity': todayHumidity})
    })
    
        dataParsed.push({'city' : city, 'data': cityData})
    
        console.log(dataParsed)
        renderData(dataParsed)
    
}

function renderData(dataParsed){
    const cityList = document.getElementById('list-tab')
    const cityContent = document.getElementById('nav-tabContent')

    dataParsed.forEach((i) => {
    const dataArray = i.data
    const city = i.city
    const id = city.replace(/\s/g, '')
    console.log(dataArray)
    console.log('hello')
    const a = document.createElement('a')
    const div = document.createElement('div')
    const cardDiv = document.createElement('div')
    a.innerHTML = `<a class="list-group-item list-group-item-action" id="${id}-tab" data-toggle="list" href="#${id}" role="tab" aria-selected="false">${i.city}</a>`
    div.classList.add('tab-pane', 'fade')
    cardDiv.classList.add('row')
    div.setAttribute('id',`${id}`)
    div.innerHTML = 
    `<h3>${i.city}</h3>
    <p>Current weather for ${i.city}</p>
    <p>Current temp: ${dataArray[0].temp}</p>
    <p>Current humidity: ${dataArray[0].humidity}</p>
    <p>Current wind: ${dataArray[0].wind}</p>
    `
    for (let i=1; i < dataArray.length; i++) {
        const current = dataArray[i]
        const cards = document.createElement('div')
        cards.classList.add('col-sm-2' , 'sub-box')
        cards.innerHTML = 
        `<h3>Date</h3>
        <p>Forecasted Temp: ${current.temp}</p>
        <p>Forecasted humidity: ${current.humidity}</p>
        <p>Forecasted wind: ${current.wind}</p>
        `
        cardDiv.appendChild(cards)
    }
    cityList.appendChild(a)
    cityContent.appendChild(div)
    div.appendChild(cardDiv)
    

    })
    console.log(cityList)
}


function saveToLocalStorage(data) {
    console.log('hello')
    localStorage.setItem('cities' , JSON.stringify(data))

}

function geoLocate(city) {
        fetch( `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=1775f1bc95aa54cad4ba6fd9830d3d95`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data){
            const longLat = {lat: data[0].lat , lon: data[0].lon}
            getWeather(longLat)
        })
        .catch(function (){
            alert('Invalid City')
        })

}

function getWeather(longLat) {
    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${longLat.lat}&lon=${longLat.lon}&appid=1775f1bc95aa54cad4ba6fd9830d3d95`)
        .then(function (response) {
            return response.json()
        })
        .then(function (data){
            parseData(data)
            console.log(weather)
        })
}

function handleForm(e) {
    e.preventDefault()
    const city = document.getElementById('searchInput').value;
    searchedList.push(city)
    saveToLocalStorage(searchedList)
    geoLocate(city)

    // console.log(city)
    // console.log(e)
}

function refreshSearchedCities() {
    console.log(searchedList)
    searchedList.forEach((city) => {
        geoLocate(city)
    })

}

function convertKelvinToFarenheit(kelvin) {
    const farenheit = Math.ceil((kelvin - 273.15) * (9/5) +32)
    return farenheit
    // console.log(farenheit)
}

function init() {
    const form = document.getElementById('search-bar')
    form.addEventListener('submit', handleForm);
    refreshSearchedCities()
}

init()