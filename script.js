const API_KEY = "";
const HISTORY_KEY = "weatherSearchHistory";
const MAS_HISTORY = 3;

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