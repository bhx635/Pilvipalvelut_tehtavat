import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const STORAGE_KEY = 'codename';

const adjectives = [
  'Sneaky',
  'Cosmic',
  'Mighty',
  'Bouncy',
  'Clever',
  'Sleepy',
  'Fuzzy',
  'Ninja',
  'Happy',
  'Electric',
];

const animals = [
  'Panda',
  'Fox',
  'Penguin',
  'Otter',
  'Dragon',
  'Raccoon',
  'Koala',
  'Llama',
  'Badger',
  'Unicorn',
];

function generateCodename() {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const number = Math.floor(Math.random() * 90) + 10;

  return `${adjective}${animal}${number}`;
}

function App() {
  const [codename, setCodename] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [storageError, setStorageError] = useState(false);

  function handleLogin() {
    try {
      const cachedName = localStorage.getItem(STORAGE_KEY);
      const name = cachedName || generateCodename();

      if (!cachedName) {
        localStorage.setItem(STORAGE_KEY, name);
      }

      setCodename(name);
      setStorageError(false);
    } catch {
      // Sovellus toimii myös silloin, jos selain estää Local Storagen käytön.
      setCodename(generateCodename());
      setStorageError(true);
    }

    setIsLoggedIn(true);
  }

  function handleLogout() {
    setIsLoggedIn(false);
  }

  return (
    <main className="card">
      <span className="eyebrow">VIIKKOTEHTÄVÄ 3</span>
      <h1>Koodinimigeneraattori</h1>
      <p className="intro">
        Kirjaudu sisään ja saat hauskan koodinimen. Nimesi säilyy tällä
        selaimella myös seuraavaa kertaa varten.
      </p>

      {isLoggedIn ? (
        <section className="welcome" aria-live="polite">
          <span className="sparkle" aria-hidden="true">✦</span>
          <p className="welcome-label">Tervetuloa, sinun koodinimesi on</p>
          <p className="codename">{codename}</p>
          {storageError ? (
            <p className="notice">
              Selain ei sallinut Local Storagen käyttöä, joten nimeä ei voitu
              tallentaa.
            </p>
          ) : (
            <p className="saved">✓ Tallennettu Local Storageen</p>
          )}
          <button
            type="button"
            className="secondary-button"
            onClick={handleLogout}
          >
            Kirjaudu ulos
          </button>
        </section>
      ) : (
        <button type="button" className="login-button" onClick={handleLogin}>
          Kirjaudu sisään
        </button>
      )}

      <footer>
        Koodinimi tallennetaan selaimen Local Storageen avaimella "codename".
      </footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
