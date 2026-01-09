const API_KEY = "";
const HISTORY_KEY = "weatherSearchHistory";
const MAX_HISTORY = 3;

const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const historySection = document.getElementById("historySection");
const errorContainer = document.getElementById("errorContainer");
const weatherContainer = document.getElementById("weatherContainer");

const weatherCodes = {
    0: { description: 'Clear sky', icon: '☀️', background: 'sunny' },
    1: { description: 'Mainly clear', icon: '🌤️', background: 'sunny' },
    2: { description: 'Partly cloudy', icon: '⛅', background: 'cloudy' },
    3: { description: 'Overcast', icon: '☁️', background: 'cloudy' },
    45: { description: 'Foggy', icon: '🌫️', background: 'cloudy' },
    48: { description: 'Foggy', icon: '🌫️', background: 'cloudy' },
    51: { description: 'Light drizzle', icon: '🌦️', background: 'rainy' },
    53: { description: 'Moderate drizzle', icon: '🌦️', background: 'rainy' },
    55: { description: 'Dense drizzle', icon: '🌧️', background: 'rainy' },
    61: { description: 'Slight rain', icon: '🌧️', background: 'rainy' },
    63: { description: 'Moderate rain', icon: '🌧️', background: 'rainy' },
    65: { description: 'Heavy rain', icon: '⛈️', background: 'rainy' },
    71: { description: 'Slight snow', icon: '🌨️', background: 'snowy' },
    73: { description: 'Moderate snow', icon: '❄️', background: 'snowy' },
    75: { description: 'Heavy snow', icon: '❄️', background: 'snowy' },
    77: { description: 'Snow grains', icon: '🌨️', background: 'snowy' },
    80: { description: 'Slight rain showers', icon: '🌦️', background: 'rainy' },
    81: { description: 'Moderate rain showers', icon: '🌧️', background: 'rainy' },
    82: { description: 'Violent rain showers', icon: '⛈️', background: 'rainy' },
    85: { description: 'Slight snow showers', icon: '🌨️', background: 'snowy' },
    86: { description: 'Heavy snow showers', icon: '❄️', background: 'snowy' },
    95: { description: 'Thunderstorm', icon: '⛈️', background: 'rainy' },
    96: { description: 'Thunderstorm with hail', icon: '⛈️', background: 'rainy' },
    99: { description: 'Thunderstorm with hail', icon: '⛈️', background: 'rainy' }
};

function init() {
    getUserLocation();
    renderHistory();
    searchForm.addEventListener("submit", handleSearch);
}

function getUserLocation() {
    if(navigator.geolocation) {
        showLoading();
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                getWeatherByCoords(latitude, longitude);
            },
            error => {
                console.error("Geolocation error: ", error);
                showError("Unable to get your location. Please search for a city.");
                clearLoading();                
            }
        );
    } else {
        showError('Geolocation is not supported by your browser. Please search for a city.');
    }
}

async function getWeatherByCoords(lat, lon) {
    try {
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,relative_humidity_2m_mean&timezone=auto`;
        
        const response = await fetch(weatherUrl);
        if (!response.ok) throw new Error('Weather data not available');
        
        const data = await response.json();
        
        const geoUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();
        const cityName = geoData.city || geoData.locality || 'Your Location';
        
        renderWeather(data, cityName);
        updateBackground(data.current.weather_code);
    } catch (error) {
        showError('Failed to fetch weather data. Please try again.');
        console.error('Error:', error);
    } finally {
        clearLoading();
    }
}

function getHistory() {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
}

function renderHistory() {
    const history = getHistory();
    
    if (history.length === 0) {
        historySection.innerHTML = '';
        return;
    }

    let html = '<h3>Recent Searches:</h3>';
    history.forEach(city => {
        html += `<button class="history-btn" onclick="searchCity('${city}')">${city}</button>`;
    });

    historySection.innerHTML = html;
}

function renderWeather(data, cityName) {
    const currentWeather = data.current;
    const daily = data.daily;
    const weatherInfo = weatherCodes[currentWeather.weather_code] || weatherCodes[0];

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    let html = `
        <div class="current-weather">
            <h2>${cityName}</h2>
            <div class="date">${currentDate}</div>
            <div class="weather-main">
                <div>
                    <div class="temperature">${Math.round(currentWeather.temperature_2m)}°C</div>
                    <div>${weatherInfo.description}</div>
                </div>
                <div class="weather-icon">${weatherInfo.icon}</div>
            </div>
            <div class="weather-details">
                <div class="detail-item">
                    <label>Humidity</label>
                    <div class="value">${currentWeather.relative_humidity_2m}%</div>
                </div>
                <div class="detail-item">
                    <label>Wind Speed</label>
                    <div class="value">${Math.round(currentWeather.wind_speed_10m)} km/h</div>
                </div>
            </div>
        </div>

        <div class="forecast-section">
            <h3>5-Day Forecast</h3>
            <div class="forecast-grid">
    `;

    for (let i = 2; i <= 6; i++) {
        const date = new Date(daily.time[i]);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const forecastWeather = weatherCodes[daily.weather_code[i]] || weatherCodes[0];
        const tempMax = Math.round(daily.temperature_2m_max[i]);
        const tempMin = Math.round(daily.temperature_2m_min[i]);
        const humidity = Math.round(daily.relative_humidity_2m_mean[i]);

        html += `
            <div class="forecast-card">
                <div class="date">${dayName}, ${monthDay}</div>
                <div class="icon">${forecastWeather.icon}</div>
                <div class="temp">${tempMax}° / ${tempMin}°</div>
                <div class="humidity">💧 ${humidity}%</div>
            </div>
        `;
    }

    html += `
            </div>
        </div>
    `;

    weatherContainer.innerHTML = html;
}

async function handleSearch(e) {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (!city) return;

    clearError();
    showLoading();

    try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('City not found');
        }

        const { latitude, longitude, name, country } = geoData.results[0];
        const fullCityName = `${name}, ${country}`;

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,relative_humidity_2m_mean&timezone=auto`;
        
        const weatherResponse = await fetch(weatherUrl);
        if (!weatherResponse.ok) throw new Error('Weather data not available');
        
        const weatherData = await weatherResponse.json();
        
        renderWeather(weatherData, fullCityName);
        updateBackground(weatherData.current.weather_code);
        saveToHistory(fullCityName);
        cityInput.value = '';
    } catch (error) {
        showError(error.message === 'City not found' ? 
            'City not found. Please check the spelling and try again.' : 
            'Failed to fetch weather data. Please try again.');
        console.error('Error:', error);
    } finally {
        clearLoading();
    }
}

function showLoading() {
    weatherContainer.innerHTML = '<div class="loading">🌍 Loading weather data...</div>';
}

function saveToHistory(cityName) {
    let history = getHistory();
    
    history = history.filter(city => city.toLowerCase() !== cityName.toLowerCase());
    
    history.unshift(cityName);
    
    history = history.slice(0, MAX_HISTORY);
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    renderHistory();
}

function showError(message) {
    errorContainer.innerHTML = `<div class="error">⚠️ ${message}</div>`;
    setTimeout(() => clearError(), 5000);
}

function clearError() {
    errorContainer.innerHTML = '';
}

function clearLoading() {
    const loading = weatherContainer.querySelector('.loading');
    if (loading) {
        weatherContainer.innerHTML = '';
    }
}

function updateBackground(weatherCode) {
    const weatherInfo = weatherCodes[weatherCode] || weatherCodes[0];
    document.body.className = weatherInfo.background;
}

function renderHistory() {
    const history = getHistory();
    
    if (history.length === 0) {
        historySection.innerHTML = '';
        return;
    }

    let html = '<h3>Recent Searches:</h3>';
    history.forEach(city => {
        html += `<button class="history-btn" onclick="searchCity('${city}')">${city}</button>`;
    });

    historySection.innerHTML = html;
}

window.searchCity = function(city) {
    cityInput.value = city;
    searchForm.dispatchEvent(new Event('submit'));
};

init();
