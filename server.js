const express = require('express');
const app = express();
const Datastore = require('nedb');
const fetch = require('node-fetch');
const database = new Datastore('database.db');
database.loadDatabase();
require('dotenv').config();
app.listen(3000, () => console.log("listening at port 3000"));

app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

app.post('/api', (request, response)=>{
    const data = request.body;
    data.timestamp = new Date().toUTCString();
    database.insert(data);
    console.log(data);
    response.json(data);
});
app.get('/api', (req, res) => {
    database.find({}, (err, data) => {
        if (err) {
            res.end();
            return;
        }
        res.json(data);
    });
});

app.get('/weather/:lat/:lon',async  (req,res) =>{
    const lat = req.params.lat;
    const lon = req.params.lon;
    const api_key = process.env.API_KEY;
    const weather_api_url = 'https://api.darksky.net/forecast/'+api_key+'/'+lat+','+lon+'?units=si';
    const weather_res = await fetch(weather_api_url);
    const weather_data = await weather_res.json();

    const AQ_api_url = 'https://api.openaq.org/v1/latest?coordinates='+lat+','+lon;
    const AQ_res = await fetch(AQ_api_url);
    const AQ_data = await AQ_res.json();
    const data = {
        weather: weather_data,
        aq: AQ_data
    };
    await res.json(data);
    // const weather_summary = json.hourly.summary;
});
// app.get('/', function (req, res) {
// //     res.send('hello world')
// })