import React, { useEffect, useRef, useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon_day from '../assets/clear-day.svg';
import clear_icon_night from '../assets/clear-night.svg';
import cloud_icon_day from '../assets/partly-cloudy-day.svg';
import cloud_icon_night from '../assets/partly-cloudy-night.svg';
import drizzle_icon_day from '../assets/partly-cloudy-day-drizzle.svg';
import drizzle_icon_night from '../assets/partly-cloudy-night-drizzle.svg';
import humidity_icon from '../assets/humidity.png';
import rain_icon from '../assets/partly-cloudy-day-rain.svg';
import snow_icon_day from '../assets/partly-cloudy-day-snow.svg';
import snow_icon_night from '../assets/partly-cloudy-night-snow.svg';
import wind_icon from '../assets/wind.svg';
import thunderStrom_icon_day from '../assets/thunderstorms-day.svg';
import thunderStrom_icon_night from '../assets/thunderstorms-night.svg';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'; const Weather = () => {
  const inputRef = useRef();
  const containerRef = useRef(null);
  const [isSearching, setIsSearching] = useState(false);
  const [weatherData, setWeatherData] = useState(false);
  const [weatherData1, setWeatherData1] = useState(false);
  const [weatherData2, setWeatherData2] = useState(false);
  const [weatherData3, setWeatherData3] = useState(false);
  const [weatherData4, setWeatherData4] = useState(false);
  const [gradientAngle, setGradientAngle] = useState(180); // Start with 180 degrees
  const [progress, setProgress] = useState(0); // State for progress
  const [isImperial, setIsImperial] = useState(false)
  const [isNightMode, setIsNightMode] = useState(false);

  const allIcons = {
    '01d': clear_icon_day,
    '01n': clear_icon_night,
    '02d': cloud_icon_day,
    '02n': cloud_icon_night,
    '03d': cloud_icon_day,
    '03n': cloud_icon_night,
    '04d': drizzle_icon_day,
    '04n': drizzle_icon_night,
    '09d': rain_icon,
    '09n': rain_icon,
    '10d': rain_icon,
    '11d': thunderStrom_icon_day,
    '11n': thunderStrom_icon_night,
    '10n': rain_icon,
    '13d': snow_icon_day,
    '13n': snow_icon_night,
  };
  const namee = {
    '01d': "clear day",
    '01n': "clear night",
    '02d': "cloud day",
    '02n': "cloud night",
    '03d': "cloud day",
    '03n': "cloud night",
    '04d': "drizzle day",
    '04n': "drizzle night",
    '09d': "rain",
    '09n': "rain",
    '10d': "rain",
    '11d': "thunderStrom day",
    '11n': "thunderStrom night",
    '10n': "rain",
    '13d': "snow day",
    '13n': "snow night",
  };
  const toggleUnits = () => {
    setIsImperial(!isImperial);
  };

  // Function to convert temperature and wind speed
  const convertTemperature = (temp) => {
    return isImperial ? Math.floor(temp * 9 / 5 + 32) : Math.floor(temp); // Celsius to Fahrenheit conversion
  };

  const convertWindSpeed = (speed) => {
    return isImperial ? Math.floor(speed * 0.621371) : Math.floor(speed); // km/h to mph conversion
  };
  const calculateGradientAngle = (timezoneOffset) => {
    const currentDate = new Date();
    const localTime = new Date(currentDate.getTime() + timezoneOffset * 1000);
    const localHour = localTime.getHours();

    let angle;
    if (localHour >= 12 && localHour < 24) {
      angle = (localHour - 12) * 15; // 0 degrees at 12 PM to 180 degrees at 12 AM
    } else {
      angle = 180 + localHour * 15; // 180 degrees at 12 AM to 360 degrees (or 0 degrees) at 12 PM
    }

    setGradientAngle(angle);
  };

  function secondsToTime(seconds) {
    const date = new Date(0);  // 0 milliseconds, starting from the Unix epoch
    date.setSeconds(seconds);  // Set the seconds of the date object
    const hours = date.getUTCHours();  // Get hours in UTC
    const minutes = date.getUTCMinutes();  // Get minutes in UTC
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  }
  const search = async (city, forceRefresh = false) => {
    if (city === '' && !forceRefresh) {
      return false;
    }
    setIsSearching(true);
    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data); // Check the structure of the data

      if (!response.ok) {
        alert(data.message || 'Failed to fetch data');
        return false;
      }

      // Check if data.list contains enough items
      if (data.list.length < 5) {
        alert('Not enough weather data available');
        return false;
      }

      // Set weather data for different time slots
      const updateWeatherData = (index) => {
        const icon = allIcons[data.list[index].weather[0].icon] || clear_icon_day;
        const name = namee[data.list[index].weather[0].icon];
        console.log(name);
        return {
          humidity: data.list[index].main.humidity,
          windSpeed: convertWindSpeed(data.list[index].wind.speed),
          temperature: convertTemperature(Math.floor(data.list[index].main.temp)),
          temperature1: convertTemperature(Math.floor(data.list[0].main.temp)),
          temperature2: convertTemperature(Math.floor(data.list[1].main.temp)),
          temperature3: convertTemperature(Math.floor(data.list[2].main.temp)),
          temperature4: convertTemperature(Math.floor(data.list[3].main.temp)),
          temperature5: convertTemperature(Math.floor(data.list[4].main.temp)),
          temperature6: convertTemperature(Math.floor(data.list[5].main.temp)),

          maxtempday1: convertTemperature(Math.floor(data.list[7].main.temp_max)),
          maxtempday2: convertTemperature(Math.floor(data.list[15].main.temp_max)),
          maxtempday3: convertTemperature(Math.floor(data.list[23].main.temp_max)),



          sunrise: secondsToTime(data.city.sunrise),
          sunset: secondsToTime(data.city.sunset),
          time0: secondsToTime(data.list[0].dt),
          time1: secondsToTime(data.list[1].dt),
          time2: secondsToTime(data.list[2].dt),
          time3: secondsToTime(data.list[3].dt),
          time4: secondsToTime(data.list[4].dt),
          time5: secondsToTime(data.list[5].dt),
          time6: secondsToTime(data.list[5].dt),
          location: data.city.name,
          icon: icon,
          name: name,
        };
      };
      setWeatherData(updateWeatherData(0));
      setWeatherData1(updateWeatherData(7));
      setWeatherData2(updateWeatherData(15));
      setWeatherData3(updateWeatherData(23));
      setWeatherData4(updateWeatherData(31));

      calculateGradientAngle(data.city.timezone);

    } catch (error) {
      console.error('Error in fetching weather data:', error);
      setWeatherData(false);
      setWeatherData1(false);
      setWeatherData2(false);
      setWeatherData3(false);
      setWeatherData4(false);
    } finally {
      inputRef.current.value = '';
      setIsSearching(false);
    }
  };
  useEffect(() => {
    const toggle = document.getElementById("toggle");
    const mainContent = document.querySelector(".main_content");
    const highlights = document.querySelectorAll(".highlight"); // Use querySelectorAll to target all highlights
    const sidebar = document.querySelector(".sidebar");
    const rain_chances = document.querySelector(".rain-chances");
    const doubling = document.querySelector(".doubling");
    const forecast_container = document.querySelector(".forecast-container");
    const section_right = document.querySelector(".section-right");
    const days = document.querySelectorAll(".day");

    const temps = document.querySelectorAll(".temp"); // Use querySelectorAll to target all highlights



    const handleToggle = () => {
      setIsNightMode((prevState) => !prevState);
      mainContent.classList.toggle("night-mode");
      sidebar.classList.toggle("night-mode");
      forecast_container.classList.toggle("night-mode");

      section_right.classList.toggle("night-mode");
      rain_chances.classList.toggle("night-mode");
      doubling.classList.toggle("night-mode");







      // Toggle night-mode for all elements with the class highlight
      highlights.forEach((highlight) => {
        highlight.classList.toggle("night-mode");

      });
      temps.forEach((temp) => {
        temp.classList.toggle("night-mode");

      });
      days.forEach((day) => {
        day.classList.toggle("night-mode");

      });
    };

    toggle.addEventListener("change", handleToggle);

    return () => {
      toggle.removeEventListener("change", handleToggle);
    };
  }, []);
  useEffect(() => {
    search('paris'); // Default search
  }, [isImperial]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission
        search(inputRef.current.value);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  // Enable mouse dragging for horizontal scrolling


  const weeking = (i) => {
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const d = new Date();
    const x = d.getDay();
    if (x + i > 6) {
      return weekday[x - (7 - i)];
    }
    else {
      return weekday[x + i];
    }

  }
  const productSales = [
    {
      time: weatherData.time0,
      Today_temperature: weatherData.temperature1,
    },
    {
      time: weatherData.time1,
      Today_temperature: weatherData.temperature2,
    },
    {
      time: weatherData.time3,
      Today_temperature: weatherData.temperature3,
    },
    {
      time: weatherData.time4,
      Today_temperature: weatherData.temperature4,
    },
    {
      time: weatherData.time5,
      Today_temperature: weatherData.temperature5,
    },
    {
      time: weatherData.time6,
      Today_temperature: weatherData.temperature6,
    },
  ];

  const AreaChartComponent = () => {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={400}
          data={productSales}
          margin={{ right: 30 }}
        >
          <YAxis />
          <XAxis dataKey="time" />
          <CartesianGrid strokeDasharray="5 5" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="Today_temperature"
            stroke="#2563eb"
            fill="#3b82f6"
            stackId="1"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 bg-slate-900 flex flex-col gap-4 rounded-md">
          <p className="text-medium text-lg">{label}</p>
          <p className="text-sm text-blue-400">
            Product 1:
            <span className="ml-2">${payload[0].value}</span>
          </p>
          {/* Only show Product 2 if it exists */}
          {payload[1] && (
            <p className="text-sm text-indigo-400">
              Product 2:
              <span className="ml-2">${payload[1].value}</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="menu-item active">Home</div>
        <div className="menu-item">Forecast</div>
        <div className="menu-item">Locations</div>
        <div className="menu-item">Analytics</div>
        <div className="menu-item">Calendar</div>
        <div className="menu-item">Settings</div>
      </aside>

      {/* Main Content */}
      <main className="doubling">

        <div className="main_content">
          {/* Header */}
          <header className="header">
            <div className="search-bar">
              <input
                type="text"
                ref={inputRef}
                className="search-input"
                placeholder="Search city name"
                onKeyDown={(e) => e.key === 'Enter' && search(e.target.value)}
              />
              <img src={search_icon} alt="Search" />
            </div>
            <div className="header-icons">
              <button className="metrics" onClick={toggleUnits}>
                Switch to {isImperial ? 'Metric' : 'Imperial'} Units
              </button>
              <div className="toggle-container">
                <input type="checkbox" id="toggle" checked={isNightMode} />
                <label for="toggle" className="toggle-label">
                  <span className="sun">☀️</span>
                  <span className="moon">🌙</span>
                  <div className="toggle-circle"></div>
                </label>
              </div>

            </div>
          </header>

          {/* Current Weather Section */}
          <section className="current-weather" style={{
            backgroundImage: `linear-gradient(${gradientAngle}deg, #000000, #134980, #f18719)`, // Apply dynamic gradient
          }}>
            <div className="location">
              <div className="loc-row">
                <center><div className='together'>
                  <div className='loc2'>
                    <img src={weatherData1.icon} alt='' className='weather-icon-small' id='e' />
                  </div>
                  <div className="weather-info">
                    <div className="weather-overlay">
                      <p className="time">{weeking(0)},{weatherData.location}
                      </p>
                      <h1>{weatherData.temperature}°{isImperial ? 'F' : 'C'}</h1>
                      <p>Wind: {weatherData.windSpeed} {isImperial ? 'mph' : 'km/h'}</p>
                    </div>
                  </div>
                </div></center>
              </div>
            </div>

          </section>

          {/* Highlights, Rain Chances, and Forecast */}
          <h4>Today's Highlights</h4>
          <section className="dashboard"  >


            <div className="highlight">
              <center><h3 className='h3'>Humidity</h3></center>
              <center><span>{weatherData.humidity}%</span></center>
            </div>

            <div className="highlight">
              <center><h3 className='h3'>Wind</h3></center>
              <center><span>{weatherData.windSpeed} km/h</span></center>
            </div>

            <div className="highlight">
              <center><h3 className='h33'>Sunrise & Sunset</h3></center>
              <center><span>{weatherData.sunrise} AM | {weatherData.sunset} PM</span></center>
            </div>
          </section>
          <center>
            {/* Graph Section with Area Chart */}
            <section className="graph">
              <AreaChartComponent />
            </section>
          </center>

        </div>
        <section className="section-right">
          {/* Rain Chances */}
          <div className="rain-chances">
            <h4>Chance of Rain</h4>
            <div className="bar-chart">
              <div className="bar" style={{ width: '10%' }}>9 AM</div>
              <div className="bar" style={{ width: '50%' }}>3 PM</div>
              <div className="bar" style={{ width: '70%' }}>6 PM</div>
            </div>
          </div>
          {/* 3-Day Forecast */}
          <div className="forecast-container">

            <div className="forecast">
              <h2>3 Days Forecast</h2>
              <div className="day">
                <div className="temp">
                  <span className="high">{weatherData1.maxtempday1}° </span>

                </div>
                <div className="details">
                  <p className="day-name">{weeking(1)}</p>
                  <p className="weather">{weatherData1.name}</p>
                  <img src={weatherData1.icon} alt='' className='weather-icon-small' />
                </div>
              </div>
              <div className="day">
                <div className="details">
                  <p className="day-name">{weeking(2)}</p>
                  <p className="weather">{weatherData2.name}</p>
                  <img src={weatherData2.icon} alt='' className='weather-icon-small' />
                </div>
                <div className="temp">
                  <span className="high">{weatherData3.maxtempday2}° </span>
                </div>

              </div>
              <div className="day">
                <div className="temp">
                  <span className="high">{weatherData3.maxtempday3}°</span>
                </div>
                <div className="details">
                  <p className="day-name">{weeking(3)}</p>
                  <p className="weather">{weatherData3.name}</p>
                  <img src={weatherData3.icon} alt='' className='weather-icon-small' />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Weather;
