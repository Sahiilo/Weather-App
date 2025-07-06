import { createContext, useEffect, useState } from 'react';
import {
  DEFAULT_PLACE,
  MEASUREMENT_SYSTEMS,
  UNITS,
} from '../constants';
import { getWeatherData } from '../api';

const WeatherContext = createContext();

function WeatherProvider({ children }) {
  const [place, setPlace] = useState(DEFAULT_PLACE);
  const [loading, setLoading] = useState(true);
  const [currentWeather, setCurrentWeather] = useState({});
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [measurementSystem, setMeasurementSystem] = useState(
    MEASUREMENT_SYSTEMS.AUTO
  );
  const [units, setUnits] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    async function _getWeatherData() {
      try {
        setLoading(true);
        setError(null);

        // Get current weather data
        const cw = await getWeatherData(
          'current',
          place.place_id,
          measurementSystem
        );
        
        console.log('Current weather response:', cw); // Debug log
        
        if (!cw) {
          throw new Error('Failed to fetch current weather data');
        }
        
        if (!cw.current) {
          console.error('Current weather data structure:', cw);
          throw new Error('Current weather data is missing "current" property');
        }
        
        setCurrentWeather(cw.current);
        setUnits(UNITS[cw.units]);

        // Get hourly forecast data
        const hf = await getWeatherData(
          'hourly',
          place.place_id,
          measurementSystem
        );
        
        console.log('Hourly forecast response:', hf); // Debug log
        
        if (hf && hf.hourly && hf.hourly.data) {
          setHourlyForecast(hf.hourly.data);
        } else {
          console.warn('Hourly forecast data is missing or invalid');
          setHourlyForecast([]);
        }

        // Get daily forecast data
        const df = await getWeatherData(
          'daily',
          place.place_id,
          measurementSystem
        );
        
        console.log('Daily forecast response:', df); // Debug log
        
        if (df && df.daily && df.daily.data) {
          setDailyForecast(df.daily.data);
        } else {
          console.warn('Daily forecast data is missing or invalid');
          setDailyForecast([]);
        }

      } catch (error) {
        console.error('Error fetching weather data:', error);
        setError(error.message);
        
        // Set fallback data to prevent crashes
        setCurrentWeather({});
        setHourlyForecast([]);
        setDailyForecast([]);
      } finally {
        setLoading(false);
      }
    }
    
    _getWeatherData();
  }, [place, measurementSystem]);

  return (
    <WeatherContext.Provider
      value={{
        place,
        setPlace,
        loading,
        currentWeather,
        hourlyForecast,
        dailyForecast,
        measurementSystem,
        setMeasurementSystem,
        units,
        error,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export { WeatherProvider };
export default WeatherContext;