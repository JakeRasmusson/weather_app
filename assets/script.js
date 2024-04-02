const search = 'atlanta'




function geoLocate() {
    fetch( `http://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=1&appid=1775f1bc95aa54cad4ba6fd9830d3d95`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data){
            const longLat = {lat: data[0].lat , lon: data[0].lon}
            console.log(longLat)
            getWeather(longLat)
        })
}
function getWeather(longLat) {
    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${longLat.lat}&lon=${longLat.lon}&appid=1775f1bc95aa54cad4ba6fd9830d3d95`)
        .then(function (response) {
            return response.json()
        })
        .then(function (data){
            const weather = data
            console.log(data)
        })
}

geoLocate()
