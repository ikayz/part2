import { useState } from 'react';

const App = () => {
  const [persons, setPersons] = useState([{ name: 'Isaac Miti' }]);
  const [newName, setNewName] = useState('');

  const addName = event => {
    event.preventDefault();
    const personObject = {
      name: newName,
      id: String(persons.length + 1),
    };

    if (persons.some(person => person.name === personObject.name)) {
      alert(`${newName} is already added to phonebook`);
    } else {
      setPersons(persons.concat(personObject));
      setNewName('');
    }
  };

  const handleNameChange = event => {
    setNewName(event.target.value);
  };

  console.log(persons[0].name);

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map(person => (
        <p key={person.name}>{person.name}</p>
      ))}
    </div>
  );
};

export default App;
