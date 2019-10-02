const api_url = "https://api.wheretheiss.at/v1/satellites/25544";
const mapbox_token = 'pk.eyJ1IjoiYW1yYW50IiwiYSI6ImNrMTZlc3lheTExdmQzb3RnYmZkOHd2dHQifQ.R_9_N2SBhgtZEKXaIN2vKg';
const mapbox_url = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}';
const maxbox_attribution = {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: mapbox_token
};
const map = L.map('map').setView([10, 0], 1);
L.tileLayer(mapbox_url, maxbox_attribution).addTo(map);
// const marker = L.marker([0,0]).addTo(map);
plot();

async function plot() {
    const data = await getData();
    for (const element of data) {
        const marker = L.marker([element.lat,element.lon]).addTo(map);
        const txt = 'The weather here is ' +element.weather_summary + ' with temperature of ' + element.temperature+ '&#8451.' + '\n' +
            'There is ' +element.aq +' µg/m³ of CO in the air';
        marker.bindPopup(txt);
    }
}

async function getData() {
    const response = await fetch('/api');
    const data = await response.json();
    return data;
}

