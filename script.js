
const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city");
const searchButton = document.getElementById("search-btn");
const statusEl = document.getElementById("status");
const weatherSection = document.getElementById("weather");
const emptyState = document.getElementById("empty-state");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    getWeather(cityInput.value.trim());
});

document.querySelectorAll("[data-city]").forEach((button) => {
    button.addEventListener("click", () => {
        cityInput.value = button.dataset.city;
        getWeather(button.dataset.city);
    });
});

function setStatus(message, isError = false) {
    statusEl.textContent = message;
    statusEl.classList.toggle("error", isError);
}

function titleCase(text) {
    return text.replace(/\b\w/g, char => char.toUpperCase());
}

function getWeatherEmoji(condition) {
    const type = (condition || "").toLowerCase();

    if (type.includes("thunder")) return "⛈️";
    if (type.includes("rain")) return "🌧️";
    if (type.includes("drizzle")) return "🌦️";
    if (type.includes("snow")) return "🌨️";
    if (type.includes("cloud")) return "☁️";
    if (
        type.includes("mist") ||
        type.includes("fog") ||
        type.includes("haze")
    ) return "🌫️";

    return "☀️";
}

async function getWeather(city) {
    if (!city) {
        setStatus("Please enter a city name.", true);
        cityInput.focus();
        return;
    }

    searchButton.disabled = true;
    searchButton.textContent = "Loading...";
    setStatus(`Getting the latest forecast for ${city}...`);

    try {
        const response = await fetch(
            `/api/weather?city=${encodeURIComponent(city)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Could not load weather."
            );
        }

        displayCurrentWeather(data.current);
        displayForecast(data.forecast);

        weatherSection.classList.remove("hidden");
        emptyState.classList.add("hidden");

        setStatus(`Showing weather for ${data.current.name}.`);
    } catch (error) {
        weatherSection.classList.add("hidden");
        emptyState.classList.remove("hidden");

        setStatus(
            error.message || "Something went wrong.",
            true
        );
    } finally {
        searchButton.disabled = false;
        searchButton.textContent = "Check weather ↗";
    }
}

function displayCurrentWeather(data) {
    const condition = data.weather[0].main;

    document.getElementById("location").textContent =
        `${data.name}${data.sys?.country ? ", " + data.sys.country : ""}`;

    const date = new Date((data.dt + data.timezone) * 1000);

    document.getElementById("date").textContent =
        date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            timeZone: "UTC"
        });

    document.getElementById("condition").textContent = condition;

    document.getElementById("temperature").textContent =
        Math.round(data.main.temp);

    document.getElementById("feels").textContent =
        `Feels like ${Math.round(data.main.feels_like)}°C`;

    document.getElementById("description").textContent =
        titleCase(data.weather[0].description);

    document.getElementById("high-low").textContent =
        `${Math.round(data.main.temp_max)}° / ${Math.round(data.main.temp_min)}°`;

    document.getElementById("humidity").textContent =
        `${data.main.humidity}%`;

    document.getElementById("wind").textContent =
        `${Math.round(data.wind.speed * 3.6)} km/h`;

    document.getElementById("visibility").textContent =
        data.visibility != null
            ? `${(data.visibility / 1000).toFixed(1)} km`
            : "N/A";

    const visual = document.getElementById("weather-visual");

    visual.classList.toggle(
        "rainy",
        ["Rain", "Thunderstorm", "Drizzle"].includes(condition)
    );
}

function displayForecast(data) {
    const forecastContainer = document.getElementById("forecast");
    forecastContainer.replaceChildren();

    const dailyForecasts = new Map();

    data.list.forEach((item) => {
        const day = item.dt_txt.split(" ")[0];

        if (!dailyForecasts.has(day)) {
            dailyForecasts.set(day, item);
        }

        if (item.dt_txt.includes("12:00:00")) {
            dailyForecasts.set(day, item);
        }
    });

    [...dailyForecasts.values()].slice(0, 5).forEach((item, index) => {
        const card = document.createElement("article");
        card.className = "forecast-card";

        const dayName = index === 0
            ? "Today"
            : new Date(item.dt * 1000).toLocaleDateString("en-US", {
                weekday: "short",
                timeZone: "UTC"
            });

        const day = document.createElement("div");
        day.className = "forecast-day";
        day.textContent = dayName;

        const icon = document.createElement("span");
        icon.className = "forecast-icon";
        icon.textContent = getWeatherEmoji(item.weather[0].main);

        const description = document.createElement("p");
        description.className = "forecast-desc";
        description.textContent = item.weather[0].description;

        const temperatures = document.createElement("div");
        temperatures.className = "forecast-temps";

        const high = document.createElement("strong");
        high.textContent = `${Math.round(item.main.temp_max)}°`;

        const low = document.createElement("span");
        low.textContent = `${Math.round(item.main.temp_min)}°`;

        temperatures.append(high, low);
        card.append(day, icon, description, temperatures);
        forecastContainer.appendChild(card);
    });
}
