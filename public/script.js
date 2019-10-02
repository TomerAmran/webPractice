
function setup() {
    noCanvas();
    const video = createCapture(VIDEO);
    video.size(320,240);
    navigator.geolocation.getCurrentPosition(async (position) => {
        document.getElementById('submitButton').addEventListener('click', submit);
        document.addEventListener("keydown", event =>{
                if (event.isComposing || event.keyCode === 13)
                    submit();
            }
        );
        const lat = position.coords.latitude.toFixed(2);
        const lon = position.coords.longitude.toFixed(2);
        document.getElementById('lat').innerText = lat;
        document.getElementById('lon').innerText = lon;
        const weather_api_url = '/weather/'+lat+'/'+lon;
        const response = await fetch(weather_api_url);
        const json = await response.json();
        const weather_summary = json.weather.currently.summary;
        const temperature = json.weather.currently.temperature;
        let aq;
        if (json.aq.results[0])
            aq = json.aq.results[0].measurements[0].value;
        else
            aq = 'NO_READING';
        document.getElementById('weather').innerText = weather_summary;
        document.getElementById('temp').innerText = temperature;
        document.getElementById('aq').innerText = aq;
        function submit() {
            const mood = document.getElementById('inputText').value;
            video.loadPixels();
            const image64 = video.canvas.toDataURL();
            const data = {lat, lon, mood, weather_summary, temperature, aq};
            const options = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            };
            fetch('/api', options).then(async (response) => {
                console.log(await response.json());
            });
        }
    });
}
