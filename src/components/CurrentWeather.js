import { useContext } from 'react';
import WeatherContext from '../context/weather.context';
import WeatherIcon from './WeatherIcon';
import '../styles/components/CurrentWeather.scss';

function CurrentWeather({ data }) {
  const { units, loading, error } = useContext(WeatherContext);

  // Handle loading state
  if (loading) {
    return (
      <div className='CurrentWeather'>
        <div className='loading'>Loading weather data...</div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className='CurrentWeather'>
        <div className='error'>
          <h3>Error loading weather data</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Handle missing data
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className='CurrentWeather'>
        <div className='no-data'>No weather data available</div>
      </div>
    );
  }

  const {
    cloud_cover,
    feels_like,
    humidity,
    icon_num,
    precipitation,
    summary,
    temperature,
    uv_index,
    visibility,
    wind,
  } = data;

  // Safety check for nested objects
  const precipitationTotal = precipitation?.total || 0;
  const windSpeed = wind?.speed || 0;

  const otherInfoWidgets = [
    {
      id: 0,
      icon: 'droplet',
      name: 'Precipitation',
      value: Math.round(precipitationTotal),
      unit: units?.precipitation || 'mm',
    },
    {
      id: 1,
      icon: 'wind',
      name: 'Wind',
      value: Math.round(windSpeed),
      unit: units?.wind_speed || 'km/h',
    },
    {
      id: 2,
      icon: 'moisture',
      name: 'Humidity',
      value: Math.round(humidity || 0),
      unit: units?.humidity || '%',
    },
    {
      id: 3,
      icon: 'sunglasses',
      name: 'UV index',
      value: Math.round(uv_index || 0),
      unit: units?.uv_index || '',
    },
    {
      id: 4,
      icon: 'clouds-fill',
      name: 'Clouds cover',
      value: Math.round(cloud_cover || 0),
      unit: units?.cloud_cover || '%',
    },
    {
      id: 5,
      icon: 'eye',
      name: 'Visibility',
      value: Math.round(visibility || 0),
      unit: units?.visibility || 'km',
    },
  ];

  return (
    <div className='CurrentWeather'>
      <div className='temperature'>
        <div className='weather-icon'>
          <WeatherIcon iconNumber={icon_num} summary={summary} />
        </div>
        <div className='value'>
          <div className='real'>
            {Math.round(temperature || 0)} {units?.temperature || '°C'}
          </div>
          <div className='feels_like'>
            feels like {Math.round(feels_like || 0)} {units?.temperature || '°C'}
          </div>
        </div>
        <div className='summary'>{summary || 'No description available'}</div>
      </div>
      <div className='other-infos'>
        {otherInfoWidgets.map(({ id, name, icon, value, unit }) => (
          <div className='widget' key={id}>
            <div className='widget-container'>
              <div className='info'>
                <div className='icon'>
                  <i className={`bi bi-${icon}`}></i>
                </div>
                <div className='value'>
                  {value} {unit}
                </div>
              </div>
              <div className='name'>{name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CurrentWeather;