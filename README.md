# ☁️ SkyPulse — Weather Forecast App

A modern, responsive weather application that delivers real-time weather conditions and a five-day forecast for cities around the world.

🌐 **Live Demo:** https://skypulse-xi.vercel.app/

## ✨ Features

- 🌡️ Real-time weather information by city
- 🌦️ Five-day weather forecast
- 💧 Humidity, wind speed, visibility, and feels-like temperature
- 📱 Responsive design for mobile and desktop
- 🔎 City search with loading and error states
- 🔐 Secure server-side weather API integration

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js serverless API on Vercel
- **Weather Data:** OpenWeather API
- **Deployment:** Vercel
- **Version Control:** Git and GitHub

## ⚙️ Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Stacklume/SkyPulse.git
   cd SkyPulse
   ```

2. Install the dependencies required by your project, if applicable.

3. Create a `.env` file or configure the environment variable in your deployment settings:

   ```env
   OPENWEATHER_API_KEY=your_api_key_here
   ```

4. Run the project using the development setup configured in your repository.

## 🔒 Security

The weather API key is stored as an environment variable and accessed through the backend rather than embedded in frontend JavaScript. Never commit real API keys or secrets to GitHub.

## 👩‍💻 Author

Developed as a portfolio project to explore frontend development, API integration, serverless backend functionality, and responsive UI design.
