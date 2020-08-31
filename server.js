'use strict';
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');


const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());


// handle the main route

app.get('/', (request, response) => {
    response.status(200).send('Welcome to my page for testing API');
});

// localhost: 3030 / location ? city = lynwood 
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.get('/trails', trailsHandler);

app.use('*', notFoundHandler);
app.use(errorHandler);



function locationHandler(request, response) {
    const city = request.query.city;
    console.log(city + "osama");
    // getLocation(city)
    let key = process.env.LOCATIONIO_KEY;
    let URL = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
    superagent.get(URL)
        .then(geoData => {
            const locationData = new Location(city, geoData.body);
            response.status(200).send(locationData);
        })
        .catch(() => {
            errorHandler('something went wrong in gtting the data from locationiq web', request, response)
        })

}



function Location(city, geoData) {
    this.search_query = city;
    this.formatted_query = geoData[0].display_name;
    this.latitude = geoData[0].lat;
    this.longitude = geoData[0].lon;
}


function weatherHandler(request, response) {
    let lat = request.query.latitude;
    let lon = request.query.longitude;
    getWeather(lat, lon)
        .then(val => {
            response.status(200).json(val);
        });
}

function getWeather(lat, lon) {
    let weatherSummaries = [];
    let key = process.env.WEATHER_KEY;
    // console.log('lon= ' + lon + '>>>>>>', 'lat= ' + lat + '>>>>>>>', 'key=' + key);
    let url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&days=8&units=S&key=${key}`;

    return superagent.get(url)
        .then(weatherData => {
            let data = weatherData.body.data;
            console.log("osama" + data);
            return data;
        })
        .then(weatherData => {

            weatherSummaries = weatherData.map(val => {
                return new Weather(val)
            });
            return weatherSummaries
        });
}

function Weather(day) {
    this.forecast = day.weather.description;
    this.time = new Date(day.valid_date).toString().slice(0, 15);
}


function trailsHandler(request, response) {
    let latitude = request.query.latitude;
    let longitude = request.query.longitude;

    getTrails(latitude, longitude)
        .then(val => {
            response.status(200).json(val);
        });
}

function getTrails(latitude, longitude) {
    let trailsArr = [];
    let key = process.env.TRAILS_KEY;
    let url = `https://www.hikingproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&key=${key}`;
    return superagent.get(url)
        .then(trailsData => {
            let data = trailsData.body.trails;
            return data;
        })
        .then(trailsData => {
            trailsArr = trailsData.map(val => {
                return new Trail(val)
            });
            return trailsArr
        });
}
function Trail(trail) {
    this.name = trail.name;
    this.location = trail.location;
    this.length = trail.length;
    this.stars = trail.stars;
    this.star_votes = trail.starVotes;
    this.summary = trail.summary;
    this.trail_url = trail.url;
    this.conditions = trail.conditionStatus;
    this.condition_date = trail.conditionDate.split(" ")[0];
    this.condition_time = trail.conditionDate.split(" ")[1];

}




// app.get('/weather', (req, res) => {
//     const weather = require('./data/weather.json');

//     let weatherArr = [];
//     weather.data.forEach(element => {
//         let time = element.datetime;
//         let forecast = element.weather.description
//         let weatherData = new Weather(forecast, time);
//         weatherArr.push(weatherData);

//     });
//     res.send(weatherArr);
//     // return weatherArr;

// });

// function Location(cityData, location) {
//     this.search_query = cityData;
//     this.formatted_query = location[0].display_name;
//     this.latitude = location[0].lat;
//     this.longitude = location[0].lon;
// }


// function Weather(forecast, time) {
//     this.forecast = forecast;
//     this.time = time;
// }


// app.use('*', (req, res) => {
//     res.status(500).send('Sorry, something went wrong');
// })


// app.use((req, res) => {
//     res.status(500).send({
//         status: 500,
//         responseText: `Sorry,something went wrong`,
//     });
// });


// app.use((error, req, res) => {
//     res.status(404).send('Sorry, something went wrong');
// })


// app.use(function (err, req, res, next) {
//     console.log(err.stack);
//     res.type('text/plain');
//     res.status(500);
//     res.send('500 Server Error');
// });

function notFoundHandler(req, res) {
    res.status(404).send('Not Found');
};

function errorHandler(error, req, res) {
    res.status(500).send(error);
};


app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
})
