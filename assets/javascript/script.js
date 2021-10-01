
//current weather
//api.openweathermap.org/data/2.5/weather?q={city name},{state code}&appid={API key}

//5 day forecast
//api.openweathermap.org/data/2.5/forecast?q={city name},{state code},{country code}&appid={API key}
let mainCity=$('#main-city');
let mainDate=$('#main-date');
let mainTemp=$('#main-temp');
let mainWind=$('#main-wind');
let mainHumidity=$('#main-hum');
let mainIconDiv=document.getElementById('main-icon');
let uv=$('#uv-index');

let search=$('#search');
let searchButton =$('#search-button');
let input="";
let history=$(".history");
let searchHistory=[];
let histCount=0;
let requestUrl="https://api.openweathermap.org/data/2.5/weather?q=";
let APIKey= "&appid=8302e357ef6f3efbd2c823a27786e610";
let fiveDayDiv=document.getElementById('forecast');

//Check if search is valid
function searchCity(city){
    //checks for valid search parameters
    if (!city || /^\s*$/.test(city)){
        console.log("invalid")
        alert("search cannot be empty")
    }
    else{
        let newUrl= requestUrl.concat(city,APIKey);
        fetch(newUrl).then(function(response) {
            if (!response.ok) {
                // make the promise be rejected if we didn't get a valid
                alert('invalid city name');
                throw new Error("Not 2xx response");  
            } else {
                getCurrentWeatherApi(city);
                //add to search history
                addHistory(city);
      
            }
        }).catch(function(err) {
            // some error here
        });
        console.log("fetch city");
        console.log(getCurrentWeatherApi(search.val()));
     
    }
}

function getCurrentWeatherApi(city){
   //get data from api
   let newUrl= requestUrl.concat(city,APIKey);
    fetch(newUrl)
    .then(function (response) {
            return response.json();
    })
    .then(function (data){
        console.log(data);
    
    //city
    mainCity.text(data.name);
    //date
    let today = new Date().toLocaleDateString();
    mainDate.text("("+today+")");
    //Weather Icon 
    let mainIcon=document.createElement('img');
    let iconCode=data.weather[0].icon;
    let iconLink="http://openweathermap.org/img/w/"+iconCode+".png"
    mainIcon.setAttribute('src',iconLink);
    mainIconDiv.appendChild(mainIcon);
    //temp
    let temperature=convertTemperature(data.main.temp);
    mainTemp.text("Temperature "+temperature);
    console.log("temperature: "+ data.main.temp);
    //wind
    let wind=convertWind(data.wind.speed);
    mainWind.text("Wind: "+wind);
    console.log("wind: "+ data.wind.speed);
    //humidity
    mainHumidity.text("Humidity: "+ data.main.humidity +"%");
    console.log("Humidity: "+ data.main.humidity +"%");
    //UV index
        //need to fetch data from different service under openweather, current does not include UV index
        // get lat and lon parameters for new call
        console.log(data.coord.lat);
        console.log(data.coord.lon);
        let lat = data.coord.lat;
        let lon = data.coord.lon;
        let secondCallUrl="https://api.openweathermap.org/data/2.5/onecall?lat=".concat(lat,"&lon=",lon,APIKey);
        fetch(secondCallUrl)
        .then(function (response){
            return response.json();
        })
        .then(function (data2){
            console.log(data2);
            //UV index
            UVindex(data2.current.uvi);
            console.log("UV-index: "+ data2.current.uvi);
  
            console.log(data2.daily[0].weather[0].main);
            fiveDayForecast(data2);
        });
    });

}

function fiveDayForecast(data2){
                //also get the daily forecast for the next 5 days
                console.log("daily");
                
                for (i=1;i<=5;i++){
                    //make cards on screen
                    let fcCard=document.createElement('div');
                    fcCard.setAttribute('class','weather-card');
                    //date
                    let fcDate=document.createElement('h6');
                    let futureDate= new Date();
                    fcDate.textContent=(futureDate.addDays(i).toLocaleDateString());
                    fcCard.appendChild(fcDate);
                    //icon
                    let fcIcon=document.createElement('img');
                    let iconCode=data2.daily[i].weather[0].icon
                    let iconLink="http://openweathermap.org/img/w/"+iconCode+".png"
                    fcIcon.setAttribute('src',iconLink);
                    fcCard.appendChild(fcIcon);
                    //temperature
                    let fcTemp=document.createElement('p');
                    fcTemp.textContent=data2.daily[i].temp.day;
                    fcCard.appendChild(fcTemp);
                    //wind
                    let fcWind=document.createElement('p');
                    fcWind.textContent=data2.daily[i].wind_speed;
                    fcCard.appendChild(fcWind);
                    //humidity
                    let fcHum=document.createElement('p');
                    fcHum.textContent=data2.daily[i].humidity;
                    fcCard.appendChild(fcHum);

                    fiveDayDiv.appendChild(fcCard);

                }
 
}

//populates the search history once search button is clicked
function addHistory(search){
    let temp=document.getElementById(search);
    //get from local storage first
    searchHistory=JSON.parse(localStorage.getItem('searches'));
    if (!temp){
    histButton = document.createElement('button');
    histButton.value=search;
    histButton.setAttribute('id',histButton.value); 
    histButton.setAttribute('class','search-history');
    histButton.textContent=search;
    console.log("created button, id: "+histButton.value);
    $(histButton).on('click',function(){
        
            getCurrentWeatherApi(this.value);
        
    });
   
    history.append(histButton);
    if (!searchHistory){
        //if history is null, set first element
        searchHistory=[histButton.value];
    }
    else{
        searchHistory.push(histButton.value);
    }
    localStorage.setItem('searches',JSON.stringify(searchHistory));
   
  }
  else{
    console.log("button already exists");
    console.log(searchHistory);
  }
return;
}

function populateHistory(){
    let storedHistory =JSON.parse(localStorage.getItem('searches'));
    if (!storedHistory){
        //do nothing if there is no history
        }
        else{
            for(i=0;i<storedHistory.length;i++){
                let histButton = document.createElement('button');
                histButton.value=storedHistory[i];
                histButton.setAttribute('id',storedHistory[i]); 
                histButton.setAttribute('class','search-history');
                histButton.textContent=storedHistory[i];
                $(histButton).on('click',function(){
                    getCurrentWeatherApi(this.value);
                })
                history.append(histButton);
                
        }
    }
}



function convertTemperature(temp){
    //converts kelvins to celsius
    temp=parseFloat((temp-275.15).toFixed(1)) +" °C";
    return temp;
}
function convertWind(wind){
    //converts mph to km/h
    wind=parseFloat((wind*1.60934).toFixed(2))+ " km/h";
    return wind;
}

function UVindex(index){
    
    if (index<=2){
        uv.addClass("text-success");
    }
    if (index>5){
        uv.addClass("text-danger");
    }
    if (index> 2&& index<5){
        uv.addClass("text-warning");
    }
    uv.text('UV-index: '+ index);
}
function check(){
    console.log();
}
//add days to date 
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

populateHistory();
// document.querySelector('.search-history').addEventListener('click', function(){
//     getCurrentWeatherApi(this.value);
// });

searchButton.click(function(){
    searchCity(search.val());
});