// ======= CONFIG =======
const API_KEY = "6c3a7b1f3e13da73c88fe9d695aee0fa";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

// ====== STATE =======
let units = localStorage.getItem("units") || "metric";
const state = { lastQuery: localStorage.getItem("lastCity") || ""};

// ======= EL =======
const el = (id) => document.getElementById(id);
const cityInput = el("cityInput");
const searchBtn = el("searchBtn");
const geoBtn = el("geoBtn");
const unitToggle = el("unitToggle");
const statusLine= el("status");

const card = el("card");
const icon = el("icon");
const city = el("city");
const time = el("time");
const cond = el("cond");
const temp = el("temp");
const feels = el("feels");
const humidity = el("humidity");
const wind = el("wind");
const msg = el("msg");


// ======= HELPERS ========
function uLabel() { return units === "metric" ? "°C" : "°F";}
function speedLabel() { return units === "metric" ? "m/s" : "mph";}

function formatLocalTime(dtSec, tzOffsetSec) {
    // dtSec: UTC seconds, tzOffsetSec: offset from UTC in seconds
    const local = new Date((dtSec + tzOffsetSec) * 1000);
    return new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "short",
        hour12: true
    }).format(local);
}

function setLoading(isLoading) {
    const text = isLoading ? '<span class="loader" aria-hidden="true"></span> Fetching weather...' : "";
    statusLine.innerHTML = text;
    searchBtn.disabled = geoBtn.disabled = isLoading;
}

function remember(query) {
    if(query) localStorage.setItem("lastCity", query);
    localStorage.setItem("units", units);
}


// ======= FETCHERS =======
async function getWeatherByCity(query) {
    if(!query) return showError("Please enter a city name.");
    setLoading(true);
    try {
        const url =`${API_URL}?q=${encodeURIComponent(query)}&units=${units}&appid=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch weather.");
        renderWeather(data);
        remember(query);
    } catch (err) {
        showError("City not found or API error." + err.message);
    } finally { setLoading(false);}
}

async function getWeatherByCoords(lat, lon) {
    setLoading(true);
    try {
        const url = `${API_URL}?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch weather.");
        renderWeather(data);
        remember(`${data.name}`);
    } catch (err) {
        showError("Could not fetch location weather." + err.message);
    } finally { setLoading(false);}
}

function renderWeather(d) {
    msg.textContent = ""; 
    msg.classList.remove('error');
    card.hidden = false;

    const iconCode = d.weather?.[0]?.icon || "01d";
    icon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    icon.alt =d.weather?.[0]?.description || "weather icon";

    city.textContent = `${d.name}, ${d.sys?.country || ''}`.trim();
    time.textContent = formatLocalTime(d.dt, d.timezone || 0);
    cond.textContent = d.weather?.[0]?.main || "-";

    temp.textContent = `${Math.round(d.main.temp)}${uLabel()}`;
    feels.textContent = `${Math.round(d.main.feels_like)}${uLabel()}`;
    humidity.textContent = `${d.main.humidity}%`;
    wind.textContent = `${Math.round(d.wind.speed)}${speedLabel()}`;
}


//   ======== EVENTS =======
searchBtn.addEventListener('click', () => getWeatherByCity(cityInput.value.trim()));
cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') getWeatherByCity(cityInput.value.trim());
});

geoBtn.addEventListener('click', () => {
    if (!navigator.geolocation) return showError('Geolocation not supported by your browser.');
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const { latitude, longitude} = pos.coords;
            getWeatherByCoords(latitude, longitude);
        },
        (err) => showError('Location access denied. You can type a city instead.')
    );
});

unitToggle.addEventListener('click', async () => {
    units = units === 'metric' ? 'imperial' : "metric";
    remember(state.lastQuery);
    if(!card.hidden) {
        if (state.lastQuery) getWeatherByCity(state.lastQuery);
    }
});

cityInput.addEventListener('input', (e) => { state.lastQuery = e.target.value.trim(); });

(function init() {
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
        cityInput.value = lastCity;
        getWeatherByCity(lastCity);
    };
})();

