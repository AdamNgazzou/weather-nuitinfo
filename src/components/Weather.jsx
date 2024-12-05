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
import ProgressBar from './ProgressBar';

const Weather = () => {
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
        return {
          humidity: data.list[index].main.humidity,
          windSpeed: data.list[index].wind.speed,
          temperature: Math.floor(data.list[index].main.temp),
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
  useEffect(() => {
    const container = containerRef.current;
    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      container.classList.add('active');
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      container.classList.remove('active');
    };

    const handleMouseUp = () => {
      isDown = false;
      container.classList.remove('active');
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed
      container.scrollLeft = scrollLeft - walk;
    };

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  useEffect(() => {
    const container = containerRef.current;

    const updateProgress = () => {
      const scrollWidth = container.scrollWidth - container.clientWidth;
      const scrollLeft = container.scrollLeft;
      const newProgress = (scrollLeft / scrollWidth) * 100;
      setProgress(newProgress);
    };

    container.addEventListener('scroll', updateProgress);

    return () => {
      container.removeEventListener('scroll', updateProgress);
    };



  }, []);
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
  const width = window.innerWidth;

  return (
    <div className="main" style={{
      ...(width <= 730
        ? { backgroundImage: `linear-gradient(${gradientAngle}deg, #000000, #134980, #f18719)` } // Apply dynamic gradient
        : {}),
    }}>
      <div className='search-bar' >
        <input
          ref={inputRef}
          type='text'
          placeholder='Search city name'
          onKeyDown={(e) => e.key === 'Enter' && search(e.target.value)}
        />
        <img src={search_icon} alt='' onClick={() => search(inputRef.current.value)} />
      </div>
      <div className="parenting" ref={containerRef}>
        <ProgressBar progress={progress} /> {/* Add ProgressBar here */}
      </div >
    </div>
  );
};

export default Weather;
