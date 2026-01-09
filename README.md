# 🌩️ The Duo Weather Dashboard
A modern and responsive weather dashboard that allows travelers to view current weather and forecasts for multiple cities around the world.

---

## ✨ Key Features
### 🌍 Automatic Location Detection
- Uses Browser Geolocation to automatically detect user's location
- Displays current weather for your region on page load
- Works anywhere in the world

---

### 🔍 City Search
- Search for any city in the world by name
- Intuitive and responsive search interface
- Input validation with user-friendly error messages

---

### 📊 Detailed Current Weather
View complete weather information:
- Temperature in real-time (°C)
- Humidity relative percentage (%)
- Wind Speed (km/h)
- Weather Condition with representative icon
- Date and time updated

---

### 📅 5-Day Forecast
Interactive cards showing:
- Date and day of the week
- Maximum and minimum temperature
- Expected weather icon
- Predicted humidity
- Hover effects for better interaction

---


### 🎨 Dynamic Weather Animations
Page background changes dynamically with CSS animations:
- ☀️ Bright sun with pulsing and rotation (sunny weather)
- ☁️ Floating clouds passing across the screen (cloudy weather)
- 🌧️ Raindrops falling continuously (rainy weather)
- ❄️ Snowflakes with rotation and glow (snowy weather)

---


### 💾 Search History
- Stores the last 3 cities searched in localStorage
- History persists even after closing the browser
- Clickable buttons to quickly search again
- Automatically removes duplicates

---

## 🛠️ Technologies Used
### Frontend
- Semantic HTML5 - Accessible and well-organized structure
- Modern CSS3 - Flexbox, Grid, animations, and glassmorphism
- Vanilla JavaScript (ES6+) - No framework dependencies

### APIs Used
- Open-Meteo API - Real-time weather data
- Open-Meteo Geocoding API - Convert city names to coordinates
- BigDataCloud API - Reverse geocoding (coordinates → city)