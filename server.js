'use strict';
const express = require('express');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = express();

// handle the main route

app.get('/', (request, response) => {
    response.status(200).send('you are doing great');
});

// localhost: 3030 / location ? city = lynwood 
app.get('/location', (req, res) => {
    const location = require('./data/location.json');
    console.log(location);
    const cityData = req.query.city;
    console.log(cityData);

    let locationData = new Location(cityData, location);
    res.send(locationData);

})

app.get('/weather', (req, res) => {
    const weather = require('./data/weather.json');

    let weatherArr = [];
    weather.data.forEach(element => {
        let time = element.datetime;
        let forecast = element.weather.description
        let weatherData = new Weather(forecast, time);
        weatherArr.push(weatherData);

    });
    res.send(weatherArr);
    // return weatherArr;

});

function Location(cityData, location) {
    this.search_query = cityData;
    this.formatted_query = location[0].display_name;
    this.latitude = location[0].lat;
    this.longitude = location[0].lon;
}


function Weather(forecast, time) {
    this.forecast = forecast;
    this.time = time;
}





app.use('*', (req, res) => {
    res.status(404).send('NOT FOUND');
})

app.use((error, req, res) => {
    res.status(500).send(error);
})

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
})
