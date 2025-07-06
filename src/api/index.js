import axios from 'axios';

const API_KEY = process.env.REACT_APP_API_KEY;

export async function getWeatherData(
  endpoint,
  place_id,
  measurementSystem
) {
  // Check if API key is available
  if (!API_KEY) {
    console.error('API key is missing. Please check your .env file.');
    throw new Error('API key is missing');
  }

  const options = {
    method: 'GET',
    url: `https://ai-weather-by-meteosource.p.rapidapi.com/${endpoint}`,
    params: {
      place_id,
      language: 'en',
      units: measurementSystem,
    },
    headers: {
      'x-rapidapi-key': API_KEY,
      'x-rapidapi-host': 'ai-weather-by-meteosource.p.rapidapi.com',
    },
  };

  try {
    console.log(`Fetching ${endpoint} data for place_id: ${place_id}`);
    const response = await axios.request(options);
    
    if (!response.data) {
      throw new Error(`No data received for ${endpoint}`);
    }
    
    console.log(`${endpoint} data received:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint} data:`, error);
    
    // If it's a network error, throw a more descriptive error
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      throw new Error(`API request failed with status ${error.response.status}`);
    } else if (error.request) {
      throw new Error('Network error: Unable to reach the API');
    } else {
      throw new Error(error.message || 'Unknown error occurred');
    }
  }
}

export async function searchPlaces(text) {
  if (!API_KEY) {
    console.error('API key is missing. Please check your .env file.');
    throw new Error('API key is missing');
  }

  const options = {
    method: 'GET',
    url: 'https://ai-weather-by-meteosource.p.rapidapi.com/find_places',
    params: {
      text,
      language: 'en',
    },
    headers: {
      'x-rapidapi-key': API_KEY,
      'x-rapidapi-host': 'ai-weather-by-meteosource.p.rapidapi.com',
    },
  };

  try {
    console.log(`Searching for places: ${text}`);
    const response = await axios.request(options);
    
    if (!response.data) {
      throw new Error('No places found');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error searching places:', error);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      throw new Error(`Place search failed with status ${error.response.status}`);
    } else if (error.request) {
      throw new Error('Network error: Unable to reach the API');
    } else {
      throw new Error(error.message || 'Unknown error occurred');
    }
  }
}