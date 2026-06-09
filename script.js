const temp = document.getElementById("temp"),
    date = document.getElementById("date-time"),
    currentLocation = document.getElementById("location"),
    condition = document.getElementById("condition"),
    rain = document.getElementById("rain"),
    mainIcon = document.getElementById("icon"),
    uvIndex = document.querySelector(".uv-index"),
    uvText = document.querySelector(".uv-text"),
    windSpeed = document.querySelector(".wind-speed"),
    sunRise = document.querySelector(".sunrise"),
    sunSet = document.querySelector(".sunset"),
    humidity = document.querySelector(".humidity"),
    visibilty = document.querySelector(".visibility"),
    humidityStatus = document.querySelector(".humidity-status"),
    airQuality = document.querySelector(".air-quality"),
    airQualityStatus = document.querySelector(".air-quality-status"),
    visibilityStatus = document.querySelector(".visibility-status"),
   weatherCards = document.querySelector("#weather-cards"),
   celciusBtn = document.querySelector(".celios.active"),
  fahrenheitBtn = document.querySelector(".faranheit"),
  tempUnit = document.querySelectorAll(".temp-unit"),
  hourlyBtn = document.querySelector(".hourly"),
  weekBtn = document.querySelector(".week"),
  SearchForm = document.querySelector("#search"),
  Search= document.querySelector("#query");


let currentCity = "";
let currentUnit = "c";
let hourlyorWeek = "week";


function getDatetime() {
    let now = new Date(),
        hour = now.getHours(),
        minutes = now.getMinutes();


    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday", 
        "Thursday",
        "Friday",
        "Saturday",

    ];

    hour = hour % 12;
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    let dayString = days[now.getDay()];
    return `${dayString}, ${hour}:${minutes}`;
}

date.innerText = getDatetime();

setInterval(() => {
    date.innerText = getDatetime();
}, 1000);

function getPublicIp() {
    fetch("https://geolocation-db.com/json/", {
        method: "GET",
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            currentCity = data.city;
             getWeatherData(data.city, currentUnit, hourlyorWeek);
        });

}
getPublicIp()


function getWeatherData(city, unit, hourlyorWeek) {

  document.getElementById("loader").classList.remove("hidden");
    const apiKey = "SPATMA25P7G9SYF9PU4LZZCHN";
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`,
        {
            method: "GET",
        }
    )
        .then((response) => response.json())
        .then((data) => {

            let today = data.currentConditions;

           
            if (unit === "c") {
                temp.innerText = today.temp;
            }
            else {
                temp.innerText = celcioustofarenheit(today.temp);
            }
            currentLocation.innerText = data.resolvedAddress;
            condition.innerText = today.conditions;
            rain.innerText = "Perc -" + today.precip + "%";
            uvIndex.innerText = today.uvindex;
            windSpeed.innerText = today.windspeed;
            humidity.innerText = today.humidity + "%";
            visibilty.innerText = today.visibility;
            airQuality.innerText = today.winddir;
            measureUvindex(today.uvindex);
            updateHumidityStatus(today.humidity);
            updateVisibiltyStatus(today.visibility);
            updateAirqualityStatus(today.winddir);
            sunRise.innerText = convertTimeTo12HourFormat(today.sunrise);
            sunSet.innerText = convertTimeTo12HourFormat(today.sunset);
            mainIcon.src = getIcon(today.icon);
            changeBackground(today.icon);
            if (hourlyorWeek ==="hourly") {
              updateForecast(data.days[0].hours, unit, "day");
            } else {
              updateForecast(data.days,unit,"week");
            }
            document.getElementById("loader").classList.add("hidden");
        })
        .catch((err) =>{
              document.getElementById("loader").classList.add("hidden");
          alert("city not found in databse")
        });
}

function celcioustofarenheit(temp) {
    return ((temp * 9) / 5 + 32).toFixed(1);
}

function measureUvindex(uvIndex) {
    if (uvIndex <= 2) {
        uvText.innerText = "low"
    }
    else if (uvIndex <= 5) {
        uvText.innerText = "Moderate"
    }
    else if (uvIndex <= 7) {
        uvText.innerText = "High"
    }
    else if (uvIndex <= 10) {
        uvText.innerText = "very high"
    }
    else {
        uvText.innerText = "Extreme"
    }
}

function updateHumidityStatus(humidity) {
  if (humidity <= 30) {
    humidityStatus.innerText = "Low";
  } else if (humidity <= 60) {
    humidityStatus.innerText = "Moderate";
  } else {
    humidityStatus.innerText = "High";
  }
}


function updateVisibiltyStatus(visibility) {
  if (visibility <= 0.03) {
    visibilityStatus.innerText = "Dense Fog";
  } else if (visibility <= 0.16) {
    visibilityStatus.innerText = "Moderate Fog";
  } else if (visibility <= 0.35) {
    visibilityStatus.innerText = "Light Fog";
  } else if (visibility <= 1.13) {
    visibilityStatus.innerText = "Very Light Fog";
  } else if (visibility <= 2.16) {
    visibilityStatus.innerText = "Light Mist";
  } else if (visibility <= 5.4) {
    visibilityStatus.innerText = "Very Light Mist";
  } else if (visibility <= 10.8) {
    visibilityStatus.innerText = "Clear Air";
  } else {
    visibilityStatus.innerText = "Very Clear Air";
  }
}



function updateAirqualityStatus(airquality) {
  if (airquality <= 50) {
    airQualityStatus.innerText = "Good👌";
  } else if (airquality <= 100) {
    airQualityStatus.innerText = "Moderate😐";
  } else if (airquality <= 150) {
    airQualityStatus.innerText = "Unhealthy for Sensitive Groups😷";
  } else if (airquality <= 200) {
    airQualityStatus.innerText = "Unhealthy😷";
  } else if (airquality <= 250) {
    airQualityStatus.innerText = "Very Unhealthy😨";
  } else {
    airQualityStatus.innerText = "Hazardous😱";
  }
}

function convertTimeTo12HourFormat(time) {
  let hour = time.split(":")[0];
  let minutes = time.split(":")[1];
  let ampm = hour >= 12 ? "pm" : "am";
  hour = hour % 12;
  hour = hour ? hour : 12; // the hour '0' should be '12'
  hour = hour < 10 ? "0" + hour : hour;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let strTime = hour + ":" + minutes+ " " + ampm;
  return strTime;
}

function getIcon(condition){
    if (condition === "partly-cloudy-day") {
      return "images/partly-cloudy.png"
    } 
    else if (condition === "partly-cloudy-night") {
      return "images/cloudy-night.png"
    }
      else if (condition === "rain") {
      return "images/rain.png"
    } 
     else if (condition === "clear-day") {
      return "images/sun.png"
    }
      else if (condition === "clear-night") {
      return "images/moon.png"
    }
    else {
      return "images/sun.png"
    }
}

function getDayName(date){
  let day= new Date(date);
  let days =[
    "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",

  ];
  return days[day.getDay()];
}
 function getHour(time){
  let hour = time.split(":")[0];
  let minutes = time.split(":")[1];
  if (hour > 12) {
    hour = hour - 12;
    return `${hour}:${minutes} PM `;
    
  } else {
    return `${hour}:${minutes} AM`;
    
  }
 }

function updateForecast(data, unit, type) {
  weatherCards.innerHTML = "";
  let day = 0;
  let numCards = 0;
  if (type === "day") {
    numCards = 24;
  } else {
    numCards = 7;
  }
  for (let i = 0; i < numCards; i++) {
    let card = document.createElement("div");
    card.classList.add("card");
    let dayName = getHour(data[day].datetime);
    if (type === "week") {
      dayName = getDayName(data[day].datetime);
    }
    let dayTemp = data[day].temp;
    if (unit === "f") {
      dayTemp = celcioustofarenheit(data[day].temp);
    }
    let iconCondition = data[day].icon;
    let iconSrc = getIcon(iconCondition);
    let tempUnit = "°C";
    if (unit === "f") {
      tempUnit = "°F";
    }
    card.innerHTML = ` <h2 class="day-name">${dayName}</h2>
  <div class="card-icon">
    <img src="${iconSrc}" alt="">
  </div>
  <div class="day-temp">
    <h2 class="temp">${dayTemp}</h2>
    <span class="temp-unit">${tempUnit}</span>
  </div>`
weatherCards.appendChild(card);
day++;

  }

  }

   
function changeBackground(condition){
  const body =document.querySelector("body");
  let bg = "" ;
     if (condition === "partly-cloudy-day") {
      bg = "images/partly-cloudy-day.jpg"
    } 
    else if (condition === "partly-cloudy-night") {
      bg =  "images/partly-cloudy-night.jpg"
    }
      else if (condition === "rain") {
      bg =  "images/raining.jpg"
    } 
     else if (condition === "clear-day") {
      bg =  "images/clear-day.jpg"
    }
      else if (condition === "clear-night") {
      bg =  "images/clear-nights1.jpg"
    }
    else {
      bg =  "images/clear-day2.jpg"
    }
    body.style.backgroundImage = `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ),url(${bg})`;
}


fahrenheitBtn.addEventListener("click",() =>{
  changeUnit("f");
});
celciusBtn.addEventListener("click",() =>{
  changeUnit("c");
});

function changeUnit(unit) {
    if (currentUnit !== unit){
      currentUnit = unit;
      {
        tempUnit.forEach((elem)=>{
          elem.innerText =`°${unit.toUpperCase()}`;
        });
        if (unit==="c") {
          celciusBtn.classList.add("active");
          fahrenheitBtn.classList.remove("active");
          
        } else {
           celciusBtn.classList.remove("active");
          fahrenheitBtn.classList.add("active");
          
        }
        getWeatherData(currentCity, currentUnit, hourlyorWeek);
      }
    }
    
}


hourlyBtn.addEventListener("click",() =>{
  changeTimeSpan("hourly");
});


weekBtn.addEventListener("click",() =>{
  changeTimeSpan("week");
});

function changeTimeSpan(unit) {
    if (hourlyorWeek !== unit){
      hourlyorWeek = unit;
    
        if (unit==="hourly") {
          hourlyBtn.classList.add("active");
          weekBtn.classList.remove("active");
          
        } else {
          hourlyBtn.classList.remove("active");
          weekBtn.classList.add("active");
          
        }
        getWeatherData(currentCity, currentUnit, hourlyorWeek);
      }
    }

SearchForm.addEventListener("submit" ,(e)=>{
  e.preventDefault();
  let location= Search.value;
  if (location) {
    currentCity = location;
    getWeatherData(currentCity, currentUnit, hourlyorWeek);
  }
})


cities =[
   "Colombo",
  "Kandy",
  "Galle",
  "Jaffna",
  "Negombo",
  "Kurunegala",
  "Matara",
  "Anuradhapura",
  "Badulla",
  "Ratnapura",
  "Puttalam",
  "Trincomalee",
  "Batticaloa",
  "Nuwara Eliya",
  "Gampaha",
  "Kalutara",
  "Hambantota",
  "Polonnaruwa",
  "Mannar",
  "Vavuniya",
  "Kilinochchi",
];

var currentFocus; 
Search.addEventListener("input", function(e)
{

RemoveSuggestions();
  console.log("input fired");
  var a,
  b,
  i,val =this.value;

  if (!val) {
    return false;
  }
  currentFocus= -1;


  a = document.createElement("ul");
  a.setAttribute("id","suggestions");
  this.parentNode.appendChild(a);

  for (i = 0; i < cities.length; i++) {
    if (cities[i].substr(0,val.length).toUpperCase()== val.toUpperCase())
       {
        b  =  document.createElement("li");
        
        b.innerHTML = "<strong>" + cities[i].substr(0,val.length) + "</strong>";

        b.innerHTML  +=cities[i].substr(val.length);
        
        b.innerHTML += "<input type='hidden' value ='" +cities[i] +"'>";

        b.addEventListener("click", function(e){


          Search.value = this.getElementsByTagName("input")[0].value;
          RemoveSuggestions();
        });

        a.appendChild(b);
    }
    
  }
});

function RemoveSuggestions() {
  var x = document.getElementById("suggestions");
  if(x) x.parentNode.removeChild(x)
  
}
Search.addEventListener("keydown", function (e) {
  var x = document.getElementById("suggestion");

  if(x) x =x.getElementsByTagName("li");

  if (e.keyCode == 40) {
    currentFocus++;

    addActive(x);
  }
  else if (e.keyCode == 38) {
    currentFocus --;

    addActive(x);
  }
  
  if (e.keyCode == 13) {
    e.preventDefault();
    if (currentFocus>-1) {
      if (x) x[currentFocus].click();
      
    }
  }
});

function addActive(x) {
  if(!x) return false;
  removeActive(x);

  if(currentFocus>= x.length) currentFocus = 0;
   if(currentFocus <0 ) currentFocus =x.length-1;


   x[currentFocus].classList.add("active");
}

function removeActive(x) {
  for(var i=0; i < x.length ;i++){
    x[i].classList.remove("active");
  }
}




















