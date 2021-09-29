let APIKey = "8302e357ef6f3efbd2c823a27786e610";

//current weather
//api.openweathermap.org/data/2.5/weather?q={city name},{state code}&appid={API key}

//5 day forecast
//api.openweathermap.org/data/2.5/forecast?q={city name},{state code},{country code}&appid={API key}

let testStr='{"coord":{"lon":-87.65,"lat":41.85},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"base":"stations","main":{"temp":293.52,"feels_like":293.07,"temp_min":291.03,"temp_max":296.71,"pressure":1016,"humidity":56},"visibility":10000,"wind":{"speed":1.79,"deg":84,"gust":3.58},"clouds":{"all":1},"dt":1632868539,"sys":{"type":2,"id":2005153,"country":"US","sunrise":1632829469,"sunset":1632872262},"timezone":-18000,"id":4887398,"name":"Chicago","cod":200}';

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
    let APIKey= "&appid=d91f911bcf2c0f925fb6535547a5ddc9";
    let newUrl= requestUrl.concat(city,APIKey)

    fetch(newUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data){
        console.log(data);
    //temp
    console.log("temperature: "+ data.main.temp);
    //wind
    console.log("wind: "+ data.wind.speed);
    //humidity
    console.log("humidity: "+ data.main.humidity);
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
            console.log("UV-index: "+ data2.current.uvi);
            //generate UV index label
            //also get the daily forecast for the next 5 days
            console.log(data2.daily[0].weather[0].main);
            fiveDayForecast(data2);
        //   console.log(data2.daily[0].weather[0].main,
        //           data2.daily[0].temp.day,
        //             data2.daily[0].wind_speed,data2.daily[0].humidity);

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
                    dailyForcast[i].status=data2.daily[i+1].weather[0].main;
                    dailyForcast[i].temp=data2.daily[i+1].temp.day;
                    dailyForcast[i].wind=data2.daily[i+1].wind_speed;
                    dailyForcast[i].humidity=data2.daily[i+1].humidity;
                }
                console.log(dailyForcast);
                //generate cards
}

//populates the search history once search button is clicked
function addHistory(search){
    let temp=document.getElementById(search);
  if (!temp){
    histButton = document.createElement('button');
    histButton.value=search;
    histButton.setAttribute('id',histButton.value); 
    histButton.setAttribute('class','search-history');
    histButton.textContent=search;
    $(histButton).on('click',function(){
        getCurrentWeatherApi(this.value);
    })
    history.append(histButton);
  }
  else{
    console.log("button already exists");
  }
return;

}


function check(){
    input=search.val();
    console.log(input);
}

// document.querySelector('.search-history').addEventListener('click', function(){
//     getCurrentWeatherApi(this.value);
// });

searchButton.click(function(){
    searchCity();
});