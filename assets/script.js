const search = ['atlanta','burlington']
const weather = []
const weatherData = JSON.parse(localStorage.getItem('data')) || []
const daysArray = [0,6,14,22,30,38]
const dataParsed = []


function parseData() {
    weatherData.forEach((place) => {
        const city = place.city.name
        const cityData = []
        daysArray.forEach((day) => {
        const today = place.list[day]
        const todayTemp = convertKelvinToFarenheit(today.main.temp)
        const todayWind = today.wind.speed
        const todayHumidity = today.main.humidity
        cityData.push({'temp':todayTemp , 'wind': todayWind, 'humidity': todayHumidity})
    })
    
        dataParsed.push({'city' : city, 'data': cityData})
    
        console.log(dataParsed)
        
    

    })
    renderData()
}

function renderData(){
    const cityList = document.getElementById('list-tab')
    const cityContent = document.getElementById('nav-tabContent')

    dataParsed.forEach((i) => {
    const dataArray = i.data
    console.log(dataArray)
    console.log('hello')
    const a = document.createElement('a')
    const div = document.createElement('div')
    const cardDiv = document.createElement('div')
    a.innerHTML = `<a class="list-group-item list-group-item-action" id="${i.city}-tab" data-toggle="list" href="#${i.city}" role="tab" aria-selected="false">${i.city}</a>`
    div.classList.add('tab-pane', 'fade')
    cardDiv.classList.add('row')
    div.setAttribute('id',`${i.city}`)
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
        console.log(current)
    }
    cityList.appendChild(a)
    cityContent.appendChild(div)
    div.appendChild(cardDiv)
    

    })
    console.log(cityList)
}


function saveToLocalStorage(data) {
    console.log('hello')
    localStorage.setItem('data' , JSON.stringify(data))

}

function geoLocate() {
    search.forEach((city) => {
        fetch( `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=1775f1bc95aa54cad4ba6fd9830d3d95`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data){
            const longLat = {lat: data[0].lat , lon: data[0].lon}
            console.log(longLat)
            getWeather(longLat)
        })

    })

}
function getWeather(longLat) {
    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${longLat.lat}&lon=${longLat.lon}&appid=1775f1bc95aa54cad4ba6fd9830d3d95`)
        .then(function (response) {
            return response.json()
        })
        .then(function (data){
            weather.push(data)
            saveToLocalStorage(weather)
        })
}


function convertKelvinToFarenheit(kelvin) {
    const farenheit = Math.ceil((kelvin - 273.15) * (9/5) +32)
    return farenheit
    console.log(farenheit)
}
parseData()