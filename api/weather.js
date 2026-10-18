
export default async function handler(req, res) {
    if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return res.status(405).json({
            error: "Method not allowed."
        });
    }

    const city = String(req.query.city || "").trim();

    if (!city || city.length > 100) {
        return res.status(400).json({
            error: "Please enter a valid city name."
        });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
        return res.status(500).json({
            error: "Weather service is not configured."
        });
    }

    try {
        async function fetchOpenWeather(endpoint) {
            const url = new URL(
                `https://api.openweathermap.org/data/2.5/${endpoint}`
            );

            url.searchParams.set("q", city);
            url.searchParams.set("appid", apiKey);
            url.searchParams.set("units", "metric");

            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                const error = new Error(data.message || "Weather request failed.");
                error.status = response.status;
                throw error;
            }

            return data;
        }

        const [current, forecast] = await Promise.all([
            fetchOpenWeather("weather"),
            fetchOpenWeather("forecast")
        ]);

        res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60");

        return res.status(200).json({
            current,
            forecast
        });
    } catch (error) {
        if (error.status === 404) {
            return res.status(404).json({
                error: "City not found. Check the spelling and try again."
            });
        }

        if (error.status === 401) {
            return res.status(502).json({
                error: "Weather service authentication failed. Check your server configuration."
            });
        }

        if (error.status === 429) {
            return res.status(503).json({
                error: "Weather service is busy. Please try again shortly."
            });
        }

        console.error("Weather API error:", error.message);

        return res.status(502).json({
            error: "Could not load weather. Please try again."
        });
    }
}
