import { useState } from 'react';

const Persons = props => {
  return props.searchFilter.map((person, id) => (
    <p key={id}>
      {person.name} {person.number}
    </p>
  ));
};

const App = () => {
  const [persons, setPersons] = useState([{ name: 'Isaac Miti' }]);
  const [newName, setNewName] = useState('');
  const [number, setNumber] = useState('');
  const [filter, setFilter] = useState('');

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
    person.name.toLowerCase().startsWith(filter.toLowerCase())
  );

  console.log(persons[0].name);

  return (
    <div>
      <h2>Phonebook</h2>
      <p>
        filter shown with <input value={filter} onChange={handleSearch} />
      </p>
      <form onSubmit={addName}>
        <h3>add a new name</h3>
        <p>
          name: <input value={newName} onChange={handleNameChange} />
        </p>
        <p>
          number: <input value={number} onChange={handleNumberChange} />
        </p>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h3>Numbers</h3>
      <Persons searchFilter={searchFilter} />
    </div>
  );
};

export default App;
