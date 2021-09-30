
//current weather
//api.openweathermap.org/data/2.5/weather?q={city name},{state code}&appid={API key}

//5 day forecast
//api.openweathermap.org/data/2.5/forecast?q={city name},{state code},{country code}&appid={API key}
let mainCity=$('#main-city');
let mainDate=$('#main-date');
let mainTemp=$('#main-temp');
let mainWind=$('#main-wind');
let mainHumidity=$('#main-hum');
let uv=$('#uv-index');

let search=$('#search');
let searchButton =$('#search-button');
let input="";
let history=$(".history");
let searchHistory=[];
let histCount=0;


//Check if search is valid
function searchCity(){
    //checks for valid search parameters
    if (!search.val() || /^\s*$/.test(search.val())){
        console.log("invalid")
        alert("search cannot be empty")
    }
    else{
        console.log("fetch city");
        getCurrentWeatherApi(search.val());
          //add to search history
          addHistory(search.val());

    }
}

function getCurrentWeatherApi(city){
   //get data from api
    
    let requestUrl="https://api.openweathermap.org/data/2.5/weather?q=";
    let APIKey= "&appid=8302e357ef6f3efbd2c823a27786e610";
    let newUrl= requestUrl.concat(city,APIKey)

   
    fetch(newUrl)
    .then(function (response) {
        //check for good api response
        if (!response.ok) {
         alert("invalid city name");
         return;
        }
        else{
            
            return response.json();
        }
    })
    .then(function (data){
        console.log(data);
    
    //city
    mainCity.text(data.name+"-");
    //date
    let today = new Date().toLocaleDateString();
    mainDate.text("("+today+")");
    //Weather Icon 
    
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
                //array for 5 days
                let dailyForcast=[{
                    status:"",
                    temp:"",
                    wind:"",
                    humidity:""
                },
                {
                    status:"",
                    temp:"",
                    wind:"",
                    humidity:""
                },
                {
                    status:"",
                    temp:"",
                    wind:"",
                    humidity:""
                },
                {
                    status:"",
                    temp:"",
                    wind:"",
                    humidity:""
                },
                {
                    status:"",
                    temp:"",
                    wind:"",
                    humidity:""
                }];

                for (i=0;i<=4;i++){
                  
                    //make cards on screen
                    dailyForcast[i].status=data2.daily[i+1].weather[0].main;
                    dailyForcast[i].temp=data2.daily[i+1].temp.day;
                    dailyForcast[i].wind=data2.daily[i+1].wind_speed;
                    dailyForcast[i].humidity=data2.daily[i+1].humidity;

                    let card=document.createElement('p');
                }
                console.log(dailyForcast);
                //generate cards
}

//populates the search history once search button is clicked
function addHistory(search){
    let temp=document.getElementById(search);
    
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
    //searchHistory.push(histButton.value);

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
populateHistory();
// document.querySelector('.search-history').addEventListener('click', function(){
//     getCurrentWeatherApi(this.value);
// });

searchButton.click(function(){
    searchCity();
});