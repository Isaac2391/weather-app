class WeatherService {

    constructor(city){
        this.city = city; 
        this.date = `'${new Date().toJSON().slice(0, 10)}'`;
        this.apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=us&key=VFZM3DEGDAYLG4M28QBWSHFYG&contentType=json`;
    }

    async accessWeatherApi(){ 

        const weatherApiResponse = await fetch(this.apiUrl)

        try { 
        if (weatherApiResponse.ok) { 
            let weatherData = await weatherApiResponse.json()
            return weatherData
        } 
       } 
       catch (error) {
        console.log(error)
       }
    }

    processApiData (weatherDataAsJSON){
        
        let weatherDataList = weatherDataAsJSON['days'][0]

        // Rounding temperature numbers down ---> Math.round((num + Number.EPSILON) * 100) / 100

        let currentWeatherInfoObject = { 
            description: weatherDataList['description'],
            humidity: weatherDataList['humidity'],
            windSpeed: weatherDataList['windspeed'],
            sunriseTime: weatherDataList['sunrise'],
            sunsetTime: weatherDataList['sunset'],
            rainChance: weatherDataList['precipprob'],
            tempFahren: Math.round((weatherDataList['temp'] + Number.EPSILON) * 100) / 100,
            feelsLikeFahren: Math.round((weatherDataList['feelslike'] + Number.EPSILON) * 100) / 100,
            tempCelsius: Math.round((((weatherDataList['temp'] - 32) * (5/9)) + Number.EPSILON) * 100) / 100,
        feelsLikeCelsius: Math.round((((weatherDataList['feelslike'] -32) * (5/9)) + Number.EPSILON) * 100) /100,
        }

        console.log(currentWeatherInfoObject)

        return currentWeatherInfoObject

    }

    updateDisplay(weatherInfoObject){

        const descDisplay = document.getElementById('weatherDescDisplay')
        descDisplay.textContent = weatherInfoObject.description

        let fahrenheitToggle = document.getElementById('Fahrenheit').checked 

        const tempDisplay = document.getElementById('weatherTempDisplay')
        const feelsLikeDisplay = document.getElementById('weatherFeelsLikeDisplay')


        if (fahrenheitToggle){
            tempDisplay.innerText = weatherInfoObject.tempFahren + "°F"
            feelsLikeDisplay.innerText = "Feels like " + weatherInfoObject.feelsLikeFahren + "°F"
        } else if (!fahrenheitToggle) {
            tempDisplay.innerText = weatherInfoObject.tempCelsius + "°C"
            feelsLikeDisplay.innerText = "Feels like " + weatherInfoObject.feelsLikeCelsius + "°C"

        }

        const humidityDisplay = document.getElementById('weatherHumidityDisplay')
        humidityDisplay.innerText = "Humidity: " + weatherInfoObject.humidity + ""

        const windSpeedDisplay = document.getElementById('weatherWindSpeedDisplay')
        windSpeedDisplay.innerText = "Wind speed: " + weatherInfoObject.windSpeed + "mph"

        const rainChanceDisplay = document.getElementById('weatherRainChanceDisplay')
        rainChanceDisplay.innerText = "Chance of rain: " + weatherInfoObject.rainChance

        const sunriseDisplay = document.getElementById('sunriseDisplay')
        sunriseDisplay.innerText = "Sunrise time: " + weatherInfoObject.sunriseTime

        const sunsetDisplay = document.getElementById('sunsetDisplay')
        sunsetDisplay.innerText = "Sunset time: " + weatherInfoObject.sunsetTime

        const dogImage = document.getElementById('dogTemperature')

        if (weatherInfoObject.feelsLikeCelsius <= 5){
            dogImage.src = "/images/winter-dog.webp"
        } else if (weatherInfoObject.feelsLikeCelsius >= 6 && weatherInfoObject.feelsLikeCelsius <= 14){
            dogImage.src = "/images/cold-dog.webp"
        } else if (weatherInfoObject.feelsLikeCelsius >= 15 && weatherInfoObject.feelsLikeCelsius <= 24){
            dogImage.src = "/images/mild-dog.avif"
        } else if (weatherInfoObject.feelsLikeCelsius >= 25){ 
            dogImage.src = "/images/beach-dog.jpg"
        }

    }
}

async function runService(cityName){
    let currentWeatherService = new WeatherService(cityName)
    let weatherDataAsJSON = await currentWeatherService.accessWeatherApi()
    let weatherObject = currentWeatherService.processApiData(weatherDataAsJSON)
    currentWeatherService.updateDisplay(weatherObject)
}

const cityForm = document.getElementById('cityForm')

cityForm.addEventListener("submit", async (e)=>{

    e.preventDefault()
    let city = document.getElementById('cityFormInput').value.trim()
    if (!city) return
    runService(city)

    })

/*

Display the information on your webpage!

Add any styling you like! */