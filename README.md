# Weather App

This is a weather app built with React and Vite. It allows users to check the weather forecast based on their location or a specified city. The app is deployed on GitHub Pages for easy access.

## Features

- **Real-time weather updates**: Get the latest weather data for a given city or current location.
- **Responsive design**: The app is fully responsive and works well on both desktop and mobile devices.
- **Interactive UI**: Displays weather information like temperature, humidity, wind speed, and more.

## Tech Stack

- **React**: A JavaScript library for building user interfaces.
- **Vite**: A fast build tool and development server for modern web projects.
- **TailwindCSS**: A utility-first CSS framework for styling.
- **Recharts**: A chart library for displaying weather data.
- **Lucide Icons**: A set of high-quality SVG icons used throughout the app.

## Installation

To run this project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AdamNgazzou/weather-nuitinfo.git
Install dependencies: Navigate to the project directory and run:
   npm install

   Start the development server: Once dependencies are installed, you can start the development server with:

npm run dev
This will start the app locally at [http://localhost:3000
Deployment
This app is deployed on GitHub Pages. Once deployed, it can be accessed at the following URL:

https://AdamNgazzou.github.io/weather-nuitinfo

Building and Deploying
To build the app for production and deploy it to GitHub Pages:

Build the app:
npm run build
Deploy to GitHub Pages:

npm run deploy
Configuration
vite.config.js
To deploy the app on GitHub Pages, make sure the base option in vite.config.js is set to your repository's name:

base: '/weather-nuitinfo/', // Make sure to match your GitHub repository name
package.json
Ensure the homepage field in package.json is set to your GitHub Pages URL:
"homepage": "https://AdamNgazzou.github.io/weather-nuitinfo"
Contributing
Feel free to fork this repository, submit issues, and contribute improvements! If you'd like to contribute:

Fork the repository.
Create a new branch (git checkout -b feature-branch).
Commit your changes (git commit -am 'Add feature').
Push to the branch (git push origin feature-branch).
Open a Pull Request.

