import { useState } from 'react';
import { createRoot } from 'react-dom/client';

const DEMO_CREDENTIALS = {
  email: 'testi@esimerkki.fi',
  password: 'ss123',
};

const adjectives = [
  'Sneaky', 'Cosmic', 'Mighty', 'Bouncy', 'Clever',
  'Sleepy', 'Fuzzy', 'Ninja', 'Happy', 'Electric',
];

const animals = [
  'Panda', 'Fox', 'Penguin', 'Otter', 'Dragon',
  'Raccoon', 'Koala', 'Llama', 'Badger', 'Unicorn',
];

function generateCodename() {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const number = Math.floor(Math.random() * 90) + 10;
  return `${adjective}${animal}${number}`;
}

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [codename, setCodename] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [loginError, setLoginError] = useState(false);

  function handleLogin(event) {
    event.preventDefault();

    if (
      email.trim().toLowerCase() !== DEMO_CREDENTIALS.email
      || password !== DEMO_CREDENTIALS.password
    ) {
      setLoginError(true);
      return;
    }

    let name;
    try {
      const cachedName = localStorage.getItem('codename');
      name = cachedName || generateCodename();
      if (!cachedName) {
        localStorage.setItem('codename', name);
      }
      setStorageError(false);
    } catch {
      name = generateCodename();
      setStorageError(true);
    }

    setCodename(name);
    setPassword('');
    setLoginError(false);
    setIsLoggedIn(true);
  }

  function handleNewCodename() {
    const name = generateCodename();
    setCodename(name);

    try {
      localStorage.setItem('codename', name);
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
    setLoginError(false);
  }

  return (
    <main className="card">
      <span className="eyebrow">VIIKKOTEHTÄVÄ 3</span>
      {isLoggedIn ? (
        <section className="welcome" aria-live="polite">
          <h1>Tervetuloa!</h1>
          <p className="welcome-label">Olet kirjautunut sisään käyttäjänä:</p>
          <p className="user-email">{DEMO_CREDENTIALS.email}</p>
          <h2>Koodinimesi:</h2>
          <p className="codename">{codename}</p>
          {storageError ? (
            <p className="notice" role="status">
              Koodinimeä ei voitu tallentaa selaimen Local Storageen.
            </p>
          ) : (
            <p className="saved" role="status">
              ✓ Tallennettu Local Storageen
            </p>
          )}
          <button
            type="button"
            className="new-codename-button"
            onClick={handleNewCodename}
          >
            Luo uusi koodinimi
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={handleLogout}
          >
            Kirjaudu ulos
          </button>
        </section>
      ) : (
        <section className="login-screen">
          <h1>Koodinimigeneraattori</h1>
          <p className="intro">
            Kirjaudu sisään ja saat hauskan koodinimen. Nimi tallennetaan
            selaimeen seuraavaa kertaa varten.
          </p>
          <form className="login-form" onSubmit={handleLogin}>
            <div className="field-row">
              <label htmlFor="email">Sähköposti</label>
              <input
                autoComplete="username"
                id="email"
                name="email"
                onChange={(event) => {
                  setEmail(event.target.value);
                  setLoginError(false);
                }}
                required
                type="email"
                value={email}
              />
            </div>
            <div className="field-row">
              <label htmlFor="password">Salasana</label>
              <input
                autoComplete="current-password"
                id="password"
                name="password"
                onChange={(event) => {
                  setPassword(event.target.value);
                  setLoginError(false);
                }}
                required
                type="password"
                value={password}
              />
            </div>
            {loginError && (
              <p className="login-error" role="alert">
                Virheellinen sähköposti tai salasana.
              </p>
            )}
            <button type="submit" className="login-button">
              Kirjaudu sisään
            </button>
          </form>
          <p className="credentials">
            Demotunnus: testi@esimerkki.fi / ss123
          </p>
        </section>
      )}
      <footer>
        Koodinimi tallennetaan selaimen Local Storageen avaimella
        {' '}<code>codename</code>.
      </footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
