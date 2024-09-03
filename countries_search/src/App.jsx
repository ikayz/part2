import { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherDetails = ({ weather }) => {
  if (!weather) return null;

  const { name } = weather;
  const { temp } = weather.main;
  const { description, icon } = weather.weather[0];

  const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

  return (
    <div>
      <h3>Weather in {name}</h3>
      <p>Temperature: {temp} degrees celcius</p>
      <img src={iconUrl} alt={description} />
      <p>Wind: {weather.wind.speed} m/s</p>
    </div>
  );
};

const App = () => {
  const apiKey = import.meta.env.VITE_API_KEY;

  const [weather, setWeather] = useState(null);
  const [value, setValue] = useState('');
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data);
        setFilteredCountries(response.data);
        setError(null);
      })
      .catch(() => {
        setCountries([]);
        setFilteredCountries([]);
        setError('Failed to fetch countries');
      });
  }, []);

  useEffect(() => {
    if (value.trim() === '') {
      setFilteredCountries(countries);
      setSelectedCountry(null);
      return;
    }

    const filtered = countries.filter(country =>
      country.name.common.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredCountries(filtered);
  }, [value, countries]);

  useEffect(() => {
    if (filteredCountries.length === 1) {
      const capital = filteredCountries[0].capital[0];

      axios
        .get(
          `http://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`
        )
        .then(response => {
          setWeather(response.data);
        })
        .catch(error => {
          console.error('Error fetching weather data:', error);
        });
    }
  }, [filteredCountries]);

  const handleChange = event => {
    setValue(event.target.value);
  };

  const handleShowCountry = country => {
    setSelectedCountry(country);
  };

  const renderSingleCountry = country => (
    <div>
      <h2>{country.name.common}</h2>
      <p>
        <strong>Capital:</strong> {country.capital?.join(', ')}
      </p>
      <p>
        <strong>Area:</strong> {country.area} km²
      </p>
      <p>
        <strong>Region:</strong> {country.region} ({country.subregion})
      </p>
      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages).map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <p>
        <strong>Flag:</strong>
      </p>
      <img
        src={country.flags.png}
        alt={`Flag of ${country.name.common}`}
        width="150"
      />

      <WeatherDetails weather={weather} />
    </div>
  );

  return (
    <div>
      <h1>Countries Search</h1>
      <label>
        Find countries
        <input value={value} onChange={handleChange} />
      </label>
      {error && <p>{error}</p>}

      {value && filteredCountries.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : value && filteredCountries.length > 1 ? (
        <ul>
          {filteredCountries.map(country => (
            <li key={country.cca3}>
              {country.name.common}{' '}
              <button onClick={() => handleShowCountry(country)}>show</button>
            </li>
          ))}
        </ul>
      ) : filteredCountries.length === 1 ? (
        renderSingleCountry(filteredCountries[0])
      ) : (
        <p>No countries found</p>
      )}

      {selectedCountry && renderSingleCountry(selectedCountry)}
    </div>
  );
};

export default App;
