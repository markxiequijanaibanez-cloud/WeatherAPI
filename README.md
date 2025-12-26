# WeatherCast

A beautiful 5-day weather forecast web application with dynamic backgrounds, geolocation support, and theme switching.

## Features

- 5-day weather forecast
- City search functionality
- Geolocation-based weather (current location)
- Temperature unit conversion (°C/°F)
- Dynamic background videos (day/night themes)
- Responsive glass-morphism UI design
- Real-time weather data from OpenWeatherMap API

## How to Use

1. Open `cast.html` in your web browser.
2. Search for a city using the search bar, or click the location button to use your current position.
3. Toggle between Celsius and Fahrenheit using the unit selector.
4. Switch between day and night themes using the theme toggle.
5. View the 5-day forecast with detailed weather information.

## Technologies Used

- HTML5
- CSS3 (with glass-morphism effects and animations)
- JavaScript (ES6+ with async/await)
- OpenWeatherMap API

## Project Structure

```
weather/
├── cast.html        # Main HTML file
├── script.js        # JavaScript logic for API calls and interactions
├── style.css        # Styling and responsive design
├── README.md        # Project documentation
├── lightmode/       # Day theme background videos
└── rain/           # Night/rain theme background videos
```

## API Requirements

This app requires an OpenWeatherMap API key. The key is currently hardcoded in `script.js`. For production use, consider using environment variables or secure key management.

## Features in Detail

- **Geolocation**: Automatically detects and uses user's location
- **Dynamic Backgrounds**: Video backgrounds that change with theme
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Graceful handling of API errors and location failures

## License

This project is open source and available under the [MIT License](LICENSE).