import { useState, useEffect } from 'react';
import axios from 'axios';

const Persons = props => {
  return props.searchFilter.map((person, id) => (
    <p key={id}>
      {person.name} {person.number}
    </p>
  ));
};

const Filter = props => {
  return (
    <p>
      filter shown with{' '}
      <input value={props.filter} onChange={props.handleSearch} />
    </p>
  );
};

const PersonForm = props => {
  return (
    <form onSubmit={props.addName}>
      <p>
        name: <input value={props.newName} onChange={props.handleNameChange} />
      </p>
      <p>
        number:{' '}
        <input value={props.number} onChange={props.handleNumberChange} />
      </p>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [number, setNumber] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/persons').then(response => {
      setPersons(response.data);
    });
  }, []);

  const addName = event => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: number,
      id: String(persons.length + 1),
    };

    if (persons.some(person => person.name === personObject.name)) {
      alert(`${newName} is already added to phonebook`);
    } else {
      setPersons(persons.concat(personObject));
      setNewName('');
      setNumber('');
    }
  };

  const handleNumberChange = event => {
    setNumber(event.target.value);
  };

  const handleNameChange = event => {
    setNewName(event.target.value);
  };

  const handleSearch = event => {
    setFilter(event.target.value);
  };

  const searchFilter = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleSearch={handleSearch} />
      <h3>add a new name</h3>
      <PersonForm
        addName={addName}
        newName={newName}
        handleNameChange={handleNameChange}
        number={number}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons searchFilter={searchFilter} />
    </div>
  );
};

export default App;
