import { useState, useEffect } from 'react';
import personService from './services/people';

const Persons = props => {
  return props.searchFilter.map((person, id) => (
    <p key={id}>
      {person.name} {person.number}
      <button onClick={() => props.delete(person.id, person.name)}>
        delete
      </button>
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

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="success">{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [number, setNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then(initialPeople => {
      setPersons(initialPeople);
    });
  }, []);

  const addName = event => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: number,
      // id: String(persons.length + 1),
    };

    const existingPerson = persons.find(
      person => person.name === personObject.name
    );

    if (existingPerson) {
      const confirmUpdate = confirm(
        `${newName} is already added to phonebook, replace the old number with a new one`
      );
      if (confirmUpdate) {
        personService
          .update(existingPerson.id, personObject)
          .then(returnPerson => {
            setPersons(
              persons.map(person =>
                person.id !== existingPerson.id ? person : returnPerson
              )
            );
            setSuccessMessage(`Updated ${personObject.name}`);
            setTimeout(() => {
              setSuccessMessage(null);
            }, 5000);
            setNewName('');
            setNewName('');
            setNumber('');
          });
      }
    } else {
      personService.create(personObject).then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        setSuccessMessage(`Added ${personObject.name}`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
        setNewName('');
        setNumber('');
      });
      console.log(persons);
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

  const deleteEntry = (id, name) => {
    personService
      .deleteContact(id, name)
      .then(() => {
        setPersons(persons.filter(n => n.id !== id));
        console.log('Contact deleted');
      })
      .catch(error => {
        console.error('Failed to delete the contact:', error);
      });
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleSearch={handleSearch} />
      <h3>add a new name</h3>
      <Notification message={successMessage} />
      <PersonForm
        addName={addName}
        newName={newName}
        handleNameChange={handleNameChange}
        number={number}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons searchFilter={searchFilter} delete={deleteEntry} />
    </div>
  );
};

export default App;
