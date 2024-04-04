// const weather = []
const searchedList = JSON.parse(localStorage.getItem('cities')) || []
const weatherData = JSON.parse(localStorage.getItem('data')) || []
// const daysArray = [0,6,14,22,30,38]

function selectDays(data) {
    console.log(data)
    const daysArray = []
    const weather = []
    const city = data.city.name

for (let i = 0; i < data.list.length; i++) {
    const current = data.list[i]
    const date = current.dt_txt.split(' ')[0]
    if (daysArray.includes(date)) {
        console.log('phil')
        continue
    } else {
        console.log('ava')
        daysArray.push(date)
        weather.push(current)

    }

}
    console.log(daysArray)
    parseData(weather,city)
}
function parseData(weather, city) {
        console.log(weather)
        const dataParsed = []
        // const city = city
        console.log('Eloise')
        const cityData = []
        weather.forEach((day) => {
        const today = day.dt_txt.split(' ')[0]
        const todayTemp = convertKelvinToFarenheit(day.main.temp)
        const todayWind = day.wind.speed
        const todayIcon = day.weather[0].icon
        const todayHumidity = day.main.humidity
        cityData.push({'temp':todayTemp , 'wind': todayWind, 'humidity': todayHumidity, 'date': today, 'icon': todayIcon})
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
    a.innerHTML = `<a class="list-group-item list-group-item-action" href="#${id}">${i.city}</a>`
    // div.classList.add('tab-pane', 'fade')
    cardDiv.classList.add('row')
    div.classList.add('weatherContent')
    div.setAttribute('id',`${id}`)
    div.innerHTML = 
    `<h3>${i.city}</h3>
    <p>Current weather for ${i.city}</p>
    <img src=https://openweathermap.org/img/wn/${dataArray[0].icon}@2x.png>
    <p>Current temp: ${dataArray[0].temp}</p>
    <p>Current humidity: ${dataArray[0].humidity}</p>
    <p>Current wind: ${dataArray[0].wind}</p>
    `
    for (let i=1; i < dataArray.length; i++) {
        const current = dataArray[i]
        const todaysDate = current.date.split('2024-')[1]
        const cards = document.createElement('div')
        cards.classList.add('col-sm-2' , 'sub-box')
        cards.innerHTML = 
        `<h3>${todaysDate}</h3>
        <img src=https://openweathermap.org/img/wn/${current.icon}@2x.png>
        <p>Temp: ${current.temp}</p>
        <p>Humidity: ${current.humidity}</p>
        <p>Wind Speed: ${current.wind}</p>
        `
        cardDiv.appendChild(cards)
    }
    cityList.appendChild(a)
    cityContent.appendChild(div)
    div.appendChild(cardDiv)
    

    })
    console.log(cityList)
}

function displayActiveWeather(event) {
    const target = event.target
    const weatherTarget = target.href.split('#')[1]
    const content = document.querySelectorAll('.weatherContent')
    for (let i = 0; i < content.length; i++) {
        const currentDiv = content[i]
        const currentId = currentDiv.id
        console.log(currentId)
        if (weatherTarget == currentId) {
            currentDiv.classList.add('weatherContentActive')
        } else {
            currentDiv.classList.remove('weatherContentActive')
        }
    }
    console.log(content)

    console.log(target)
    console.log(weatherTarget)

}

function saveToLocalStorage(data) {
    console.log('hello')
    localStorage.setItem('cities' , JSON.stringify(data))

}

function geoLocate(city) {
        fetch( `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=1775f1bc95aa54cad4ba6fd9830d3d95`)
        .then(function (response) {
            if (!response.ok) {
                showError(`Error fetching coordinates ${response.status}`)
            }
            return response.json();
        })
        .then(function (data){
            const longLat = {lat: data[0].lat , lon: data[0].lon}
            getWeather(longLat)
        })

}

function getWeather(longLat) {
    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${longLat.lat}&lon=${longLat.lon}&appid=1775f1bc95aa54cad4ba6fd9830d3d95`)
        .then(function (response) {
            if (!response.ok) {
                showError(`Error fetching weather ${response.status}`)}

            return response.json()
        })
        .then(function (data){
            selectDays(data)
        })
        .catch(function () {
            alert('No response')
        })
}

function handleForm(e) {
    e.preventDefault()
    const city = document.getElementById('searchInput').value;
    if (city == ''){
        alert('Please complete field')
    } else {
    searchedList.push(city)
    saveToLocalStorage(searchedList)
    geoLocate(city)
    }
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
    const listDiv = document.getElementById('list-tab')
    console.log(listDiv)
    listDiv.addEventListener('click', function(e) {
        displayActiveWeather(e)
    });

    form.addEventListener('submit', handleForm);
    refreshSearchedCities()

    //todo event listener / event handling for buttons and make it refresh weather info
}

init()