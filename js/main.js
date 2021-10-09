const WEATHER_API_KEY = /* openweathermap.org api key information */

class Weather {
    constructor(data) {
        this.city=data.name;
        this.weather=data.weather[0].main;
        this.temp=parseInt((data.main.temp - 273.15)*9/5+32);
        this.feeltemp=parseInt((data.main.feels_like - 273.15)*9/5+32);
        this.temp_min=parseInt((data.main.temp_min - 273.15)*9/5+32);
        this.temp_max=parseInt((data.main.temp_max - 273.15)*9/5+32);
        this.description=data.weather[0].description;
        this.pressure=data.main.pressue;
        this.humidity=data.main.humidity;
        this.windspeed=data.wind.speed;
        this.cloud=data.clouds.all;
        this.icon=data.weather[0].icon;
        this.timezone=data.timezone;
    }
}

class NextWeather extends Weather{
    constructor(data) {
        super(data);
        this.date=data.dt_txt;
    }
} 

class Forecast {
    constructor(data) {
        this.city=data.city.name;
        this.forecastlist = data.list;
    }
}

const requestWeather = async(cityname) => {
    const apiKey = WEATHER_API_KEY;
    let request = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${apiKey}`);
    let data = await request.json();
    
    displayTodayWeather(data);
}

const requestWeatherZip = async(cityzip) => {
    const apiKey = WEATHER_API_KEY;
    let request = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${cityzip},us&appid=${apiKey}`);
    let data = await request.json();
    
    displayTodayWeather(data);
}

const requestWeatherCoords = async(lat, lon) => {
    const apiKey = WEATHER_API_KEY;
    let request = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    let data = await request.json();

    displayTodayWeather(data);
}

const requestForecast = async(city) => {
    const apiKey = WEATHER_API_KEY;
    let request = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`);
    let data = await request.json();

    displayForecast(data);
}

const requestForecastZip = async(cityZip) => {
    const apiKey = WEATHER_API_KEY;
    let request = await fetch(`https://api.openweathermap.org/data/2.5/forecast?zip=${cityZip}&appid=${apiKey}`);
    let data = await request.json();

    displayForecast(data);
}

const requestForecastCoords = async(lat, lon) => {
    const apiKey = WEATHER_API_KEY;
    let request = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    let data = await request.json();

    displayForecast(data);
}

function calcTime(offset) {
    d = new Date(); 
    utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    nd = new Date(utc+(1000*offset));
    return nd.toLocaleString('en-US');
}

const displayTodayWeather = (data) => {
    let today = new Weather(data);
    datetime = calcTime(today.timezone);
    background = backgroundChange(today.description);
    console.log(background);
    document.getElementById("video-bg").src= background;
    document.querySelector(".date").innerText = datetime;
    document.querySelector(".city").innerText = today.city;
    document.querySelector(".temp").innerText = today.temp + "°F";
    document.querySelector(".minmaxtemp").innerText = today.temp_min + "/" + today.temp_max;
    document.querySelector(".description").innerText = "Feels like " +  today.feeltemp + "°F. " + today.description + ".";
    document.querySelector(".humidity").innerHTML = `<i class="wi wi-humidity" style="color:#868B94;"><span class="ms-1">&nbsp;&nbsp;${today.humidity}%</span></i>`;
    document.querySelector(".wind").innerHTML = `<i class="wi wi-strong-wind" style="color:#868B94;"><span class="ms-1">&nbsp;${today.windspeed}km/h</span></i>`;
    document.getElementById("weatherImg").src = `http://openweathermap.org/img/wn/${today.icon}@2x.png`
}

const displayForecast = (data) =>{
    clearTable();
    let forecast = new Forecast(data);

    let forecastlist = [];
    for (let i=0; i < forecast.forecastlist.length; i++){
        forecastdata = new NextWeather(forecast.forecastlist[i]);
        forecastlist.push(forecastdata);
    }
    forecastlist.forEach(fillTable);
}
 
function fillTable(value, index, array) {
    var tablebody = document.getElementById("futuretable").getElementsByTagName('tbody')[0];
    var row = tablebody.insertRow();
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = `${value.date}`;
    cell2.innerHTML = `<img src="http://openweathermap.org/img/wn/${value.icon}@2x.png" style="width:50px; height:50px;"/> ${value.temp_min}/${value.temp_max}°F`;
    cell3.innerHTML = `${value.description}`;
}

function clearTable() {
    var tbody = document.getElementById("futuretable").getElementsByTagName('tbody')[0];
    tbody.innerHTML = "";
}

function backgroundChange(data) {
    let source = '';
    if (data.includes("scattered")) {
        source = "images/cloud.mp4";
    } else if (data.includes("light rain") || data.includes("moderate rain")) {
        source = "images/rainy.mp4";
    } else if (data.includes("intensity rain") || data.includes("shower rain")) {
        source = "images/heavyrain.mp4";
    } else if (data.includes("snow")) {
        source ="images/snow.mp4";
    } else if (data.includes("clear")) {
        source = "images/bright.mp4";
    } else if (data.includes("overcast")) {
        source = "images/dark.mp4";
    } else if (data.includes("broken")) {
        source = "images/cloud.mp4";
    } else if (data.includes("few")) {
        source = "images/Vivid_blue_sky.mp4";
    } else if (data.includes("mist") || data.includes("fog")) {
        source = "images/fog.mp4";
    }
    return source;
}

const form = document.getElementsByClassName('form-inline')
console.log(form);

form[0].addEventListener("submit", function(event){
    console.log("event happend")
    event.preventDefault();
    
    let city = event.path[0][0].value;

    if (hasNumber(city)){
        requestWeatherZip(city);
        requestForecastZip(city);
    } else {
        requestWeather(city);
        requestForecast(city);
    }
});

function hasNumber(myString) {
    return /\d/.test(myString);
}

function currentlocation(){
    // Get the element with id="defaultOpen" and click on it
    document.getElementById("defaultOpen").click();
    var options = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0
    };
    navigator.geolocation.getCurrentPosition(success, error, options);
    
}

function success(pos) {
    var crd = pos.coords;

    console.log(`Latitude: ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    
    requestWeatherCoords(crd.latitude, crd.longitude);
    requestForecastCoords(crd.latitude, crd.longitude);
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    return None;
}

function openTab(event, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    event.currentTarget.className += " active";
}


currentlocation();
