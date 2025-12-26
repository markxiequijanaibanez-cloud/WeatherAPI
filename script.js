 
const statusDisplay = document.getElementById('status');
const forecastContainer = document.getElementById('forecast');
const inputCity = document.getElementById('cityInput');
const buttonSearch = document.getElementById('searchBtn');
const buttonLocation = document.getElementById('locBtn');
const unitSelector = document.getElementById('unitSelect');
const themeButton = document.getElementById('themeToggle');
const mainScreen = document.querySelector('.screen');
const dayVideo = document.getElementById('bgMainDay');
const nightVideo = document.getElementById('bgMainNight');


const OWM_KEY = '9b4b339006520dffd92c03351f1701f7';

 
 
function retrieveApiKey() {
    const key = OWM_KEY || localStorage.getItem('OWM_API_KEY') || '';
    return key;
}


function updateStatus(msg) {
    statusDisplay.textContent = msg;
}

buttonSearch.addEventListener('click', () => {
    const city = inputCity?.value.trim();
    if (!city) return updateStatus('Enter a city.');
    getWeatherCity(city);
});

inputCity?.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        const city = inputCity?.value.trim();
        if (!city) return updateStatus('Enter a city.');
        getWeatherCity(city);
    }
});

buttonLocation.addEventListener('click', () => {
    if (!navigator.geolocation) return updateStatus('Geolocation not supported.');
    updateStatus('Locating...');
    navigator.geolocation.getCurrentPosition(pos => {
        getWeatherCoords(pos.coords.latitude, pos.coords.longitude);
    }, () => updateStatus('Unable to get location.'));
});

themeButton?.addEventListener('click', () => {
    const target = mainScreen || document.body;
    const isNight = target.classList.contains('night');
    target.classList.toggle('night', !isNight);
    target.classList.toggle('day', isNight);
    document.body.classList.toggle('night', !isNight);
    document.body.classList.toggle('day', isNight);
    themeButton.setAttribute('aria-pressed', String(!isNight));
    themeButton.textContent = !isNight ? 'Off' : 'On';
    try {
        if (!isNight && nightVideo) {
            nightVideo.loop = false;
            nightVideo.currentTime = 0;
            nightVideo.play().catch(() => {});
        }
        if (isNight && dayVideo) {
            dayVideo.loop = false;
            dayVideo.currentTime = 0;
            dayVideo.play().catch(() => {});
        }
    } catch (e) {}
});

(function setInitialTheme() {
    const hour = new Date().getHours();
    const night = hour < 6 || hour >= 18;
    const target = mainScreen || document.body;
    target.classList.toggle('night', night);
    target.classList.toggle('day', !night);
    document.body.classList.toggle('night', night);
    document.body.classList.toggle('day', !night);
    if (themeButton) {
        themeButton.setAttribute('aria-pressed', String(night));
        themeButton.textContent = night ? '🌙' : '☀️';
    }
    try {
        if (night && nightVideo) {
            nightVideo.loop = false;
            nightVideo.currentTime = 0;
            nightVideo.play().catch(() => {});
        }
        if (!night && dayVideo) {
            dayVideo.loop = false;
            dayVideo.currentTime = 0;
            dayVideo.play().catch(() => {});
        }
    } catch (e) {}
})();

async function getWeatherCity(city) {
    const key = retrieveApiKey();
    if (!key) return updateStatus('⚠️ API Key not set');

    try {
        updateStatus(`Fetching weather for ${city}...`);
        const units = 'metric';

        const curResp = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${key}&units=${units}`);
        if (!curResp.ok) {
            const err = await curResp.json();
            updateStatus(`API Error (${curResp.status}): ${err.message || 'Check API key'}`);
            return;
        }
        const current = await curResp.json();

        const fResp = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${key}&units=${units}`);
        if (!fResp.ok) {
            updateStatus('Forecast not available');
            return;
        }
        const forecast = await fResp.json();

        renderWeatherData(current, forecast);
        updateStatus(`5-day forecast for ${current.name}, ${current.sys.country}`);
    } catch (err) {
        console.error(err);
        updateStatus(`Error: ${err.message}`);
    }
}

async function getWeatherCoords(lat, lon) {
    const key = retrieveApiKey();
    if (!key) return updateStatus('⚠️ API Key not set');

    try {
        updateStatus('Fetching weather for your location...');
        const units = 'metric';

        const curResp = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=${units}`);
        if (!curResp.ok) {
            const err = await curResp.json();
            updateStatus(`API Error (${curResp.status}): ${err.message || 'Check API key'}`);
            return;
        }
        const current = await curResp.json();

        const fResp = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=${units}`);
        if (!fResp.ok) {
            updateStatus('Forecast not available');
            return;
        }
        const forecast = await fResp.json();

        renderWeatherData(current, forecast);
        updateStatus(`5-day forecast for ${current.name}, ${current.sys.country}`);
    } catch (err) {
        console.error(err);
        updateStatus(`Error: ${err.message}`);
    }
}

function renderWeatherData(current, forecast) {
    forecastContainer.innerHTML = '';
    const unit = (unitSelector?.value) || 'C';
    const isF = unit === 'F';
    const convertTemp = c => isF ? Math.round((c * 9 / 5) + 32) : Math.round(c);
    const tempUnit = isF ? '°F' : '°C';

    // Current
    const cardNow = document.createElement('article');
    cardNow.className = 'card';
    const titleNow = document.createElement('div');
    titleNow.className = 'date';
    titleNow.textContent = `${current.name} — Now`;
    cardNow.appendChild(titleNow);

    const iconNow = document.createElement('div');
    iconNow.className = 'icon';
    iconNow.innerHTML = `<img src="https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png" alt="weather" class="weather-icon">`;
    cardNow.appendChild(iconNow);

    const descNow = document.createElement('div');
    descNow.className = 'desc';
    descNow.textContent = current.weather[0].description;
    cardNow.appendChild(descNow);

    const tempsNow = document.createElement('div');
    tempsNow.className = 'temps';
    tempsNow.innerHTML = `<div class="temp-max">${convertTemp(current.main.temp)}${tempUnit}</div><div class="temp-min">💧 ${current.main.humidity}%</div>`;
    cardNow.appendChild(tempsNow);
    forecastContainer.appendChild(cardNow);

    // Forecast
    const daily = groupForecastByDay(forecast.list);
    Object.keys(daily).slice(0, 5).forEach(dateKey => {
        const dayData = daily[dateKey];
        const maxT = Math.max(...dayData.temps);
        const minT = Math.min(...dayData.temps);

        const card = document.createElement('article');
        card.className = 'card';
        const dateEl = document.createElement('div');
        dateEl.className = 'date';
        dateEl.textContent = new Date(dateKey + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
        card.appendChild(dateEl);

        const iconEl = document.createElement('div');
        iconEl.className = 'icon';
        iconEl.innerHTML = `<img src="https://openweathermap.org/img/wn/${dayData.iconCode || '01d'}@2x.png" alt="weather" class="weather-icon">`;
        card.appendChild(iconEl);

        const descEl = document.createElement('div');
        descEl.className = 'desc';
        descEl.textContent = dayData.description;
        card.appendChild(descEl);

        const tempsEl = document.createElement('div');
        tempsEl.className = 'temps';
        tempsEl.innerHTML = `<div class="temp-max">${convertTemp(maxT)}${tempUnit}</div><div class="temp-min">${convertTemp(minT)}${tempUnit}</div>`;
        card.appendChild(tempsEl);

        const humEl = document.createElement('div');
        humEl.className = 'desc';
        humEl.textContent = `💧 ${Math.round(dayData.avgHumidity)}%`;
        card.appendChild(humEl);

        forecastContainer.appendChild(card);
    });
}

function groupForecastByDay(list) {
    const groups = {};
    list.forEach(item => {
        const dateKey = item.dt_txt.split(' ')[0];
        if (!groups[dateKey]) groups[dateKey] = { temps: [], humidities: [], weatherIds: [], descriptions: [], mainWeatherId: null, description: '', iconCode: '' };
        groups[dateKey].temps.push(item.main.temp);
        groups[dateKey].humidities.push(item.main.humidity);
        groups[dateKey].weatherIds.push(item.weather[0].id);
        groups[dateKey].descriptions.push(item.weather[0].main);
        if (item.dt_txt.includes('12:00:00')) {
            groups[dateKey].mainWeatherId = item.weather[0].id;
            groups[dateKey].description = item.weather[0].main;
            groups[dateKey].iconCode = item.weather[0].icon;
        }
    });
    Object.keys(groups).forEach(dateKey => {
        const g = groups[dateKey];
        g.avgHumidity = g.humidities.reduce((a, b) => a + b, 0) / g.humidities.length;
        if (!g.mainWeatherId) {
            g.mainWeatherId = g.weatherIds[0];
            g.description = g.descriptions[0];
            g.iconCode = g.iconCode || '01d';
        }
    });
    return groups;
}