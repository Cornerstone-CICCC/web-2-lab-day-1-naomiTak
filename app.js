const searchbtn = document.querySelector("#search_btn");

async function searchCity(cityName){
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`)
    const data = await res.json()
    console.log(data);
    const weatherInfo = data.results[0]
    return weatherInfo
}

async function searchWeather(cityInfo){
    console.log(`${cityInfo.latitude} : ${cityInfo.longitude}`)
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${cityInfo.latitude}&longitude=${cityInfo.longitude}&current=temperature_2m,is_day,rain,showers&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`)
    const data = await res.json()
    console.log(data);
    return data
}

if (searchbtn) {
    searchbtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const city = document.querySelector("#cityname").value;
        if(!city){
            alert("enter a city name");
            return
        }
        const result_city = await searchCity(city);
        if(!result_city.country){
            alert(`not found ${city}`);
            return
        }
        document.querySelector(".result_area").classList.add("showing");
        console.log(result_city)
        const result_weather = await searchWeather(result_city);

        const skyimg = document.querySelector(".result_skyimg");
        const img = document.querySelector("#skyimg");
        if(result_weather.current.is_day){
            img.setAttribute("src", "./images/day.jpg");
            document.querySelector("body").classList.remove("night");
        }else{
            img.setAttribute("src", "./images/night.jpg");
            document.querySelector("body").classList.add("night");
        }
        skyimg.appendChild(img);

        document.querySelector("#result_cityname").innerText = result_city.name;
        document.querySelector("#result_temperature").innerText = `${result_weather.current.temperature_2m}℃`;

        document.querySelector("#result_country").innerText = result_city.country;
        document.querySelector("#result_timezone").innerText = result_weather.timezone;
        document.querySelector("#result_population").innerText = result_city.population;
        document.querySelector("#result_forecast_max").innerText = `Max:${result_weather.daily.temperature_2m_max}℃`;
        document.querySelector("#result_forecast_min").innerText = `Low:${result_weather.daily.temperature_2m_min}℃`;
    })
}