function updateTime() {
    const time = new Date().toLocaleTimeString("en-CA", {
        hour: "2-digit",
        minute: "2-digit"
    });

    document.getElementById("currentTime").textContent = "Time: " + time;
}

async function updateWeather() {
    const weatherElement = document.getElementById("weather");

    try {
        const response = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=51.0447&longitude=-114.0719&current=temperature_2m&temperature_unit=celsius&timezone=America%2FEdmonton"
        );

        if (!response.ok) {
            throw new Error("Weather request failed");
        }

        const data = await response.json();
        const temperature = Math.round(data.current.temperature_2m);

        weatherElement.textContent = `Temperature: ${temperature}°C`;
    } catch (error) {
        weatherElement.textContent = "Temperature unavailable";
        console.error("Could not retrieve temperature:", error);
    }
}

document.getElementById("year").textContent = new Date().getFullYear();

updateTime();
setInterval(updateTime, 60000);

updateWeather();
setInterval(updateWeather, 600000);
