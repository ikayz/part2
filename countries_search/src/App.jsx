import { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
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
