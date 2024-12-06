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
        const rain = data.list[index].rain ? data.list[index].rain["3h"] : 0; // Precipitation (in mm)

        return {
          humidity: data.list[index].main.humidity,
          windSpeed: data.list[index].wind.speed,
          temperature: Math.floor(data.list[index].main.temp),
          temperature1: Math.floor(data.list[0].main.temp),
          temperature2: Math.floor(data.list[1].main.temp),
          temperature3: Math.floor(data.list[2].main.temp),
          temperature4: Math.floor(data.list[3].main.temp),
          temperature5: Math.floor(data.list[4].main.temp),
          temperature6: Math.floor(data.list[5].main.temp),


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
    search('paris'); // Default search
  }, []);

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
      time: weatherData3.time0,
      Today_temperature: weatherData3.temperature1,
    },
    {
      time: weatherData3.time1,
      Today_temperature: weatherData3.temperature2,
    },
    {
      time: weatherData3.time3,
      Today_temperature: weatherData3.temperature3,
    },
    {
      time: weatherData3.time4,
      Today_temperature: weatherData3.temperature4,
    },
    {
      time: weatherData3.time5,
      Today_temperature: weatherData3.temperature5,
    },
    {
      time: weatherData3.time6,
      Today_temperature: weatherData3.temperature6,
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

        <div className="main-content">
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
              <span className="icon">🔔</span>
              <span className="icon">👤</span>
            </div>
          </header>

          {/* Current Weather Section */}
          <section className="current-weather" style={{
            backgroundImage: `linear-gradient(${gradientAngle}deg, #000000, #134980, #f18719)`, // Apply dynamic gradient
          }}>
            <div className="location">
              <div className="loc-row">
                <div className='loc1'>
                  <h4>Current Location</h4>
                  <h3>{weatherData3.location}</h3>
                </div>
                <div className='loc2'>
                  <img src={weatherData1.icon} alt='' className='weather-icon-small' />
                </div>
              </div>
            </div>
            <div className="weather-info">
              <div className="weather-overlay">
                <center><p className="time">{weeking(0)}</p></center>
                <center><h1 className="temp">{weatherData.temperature}°C</h1></center>
                <center><p className="condition">Partly Cloudy</p></center>
              </div>
            </div>
          </section>

          {/* Highlights, Rain Chances, and Forecast */}
          <h4>Today's Highlights</h4>
          <section className="dashboard"  >


            <div className="highlight">
              <center><h3 className='h3'>Humidity</h3></center>
              <center><span>{weatherData3.humidity}%</span></center>
            </div>

            <div className="highlight">
              <center><h3 className='h3'>Wind</h3></center>
              <center><span>{weatherData3.windSpeed} km/h</span></center>
            </div>

            <div className="highlight">
              <center><h3 className='h33'>Sunrise & Sunset</h3></center>
              <center><span>{weatherData3.sunrise} AM | {weatherData3.sunset} PM</span></center>
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
          <div className="forecast">
            <h4>3 Days Forecast</h4>
            <div className="forecast-item">
              <p>Tuesday</p>
              <span>26°C / 11°C</span>
              <span>Cloudy</span>
            </div>
            <div className="forecast-item">
              <p>Wednesday</p>
              <span>26°C / 11°C</span>
              <span>Rainy</span>
            </div>
            <div className="forecast-item">
              <p>Thursday</p>
              <span>26°C / 11°C</span>
              <span>Snowfall</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Weather;
