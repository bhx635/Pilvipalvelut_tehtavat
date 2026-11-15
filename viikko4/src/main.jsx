import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

const DEMO_CREDENTIALS = {
  email: 'testi@esimerkki.fi',
  password: 'ss123',
};

const adjectives = [
  'Hiljainen', 'Utelias', 'Nopea', 'Viisas', 'Rohkea',
  'Lempeä', 'Salaperäinen', 'Reipas', 'Näppärä', 'Aurinkoinen',
];

const animals = [
  'Lisko', 'Kettu', 'Panda', 'Pöllö', 'Saukko',
  'Kani', 'Ilves', 'Siili', 'Karhu', 'Lokki',
];

function generateCodename() {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const number = Math.floor(Math.random() * 9000) + 1000;
  return `${adjective}${animal}${number}`;
}

function App() {
<<<<<<< HEAD
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [codename, setCodename] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [loginError, setLoginError] = useState(false);

  function handleLogin(event) {
    event.preventDefault();

    if (
      email.trim().toLocaleLowerCase() !== DEMO_CREDENTIALS.email ||
      password !== DEMO_CREDENTIALS.password
    ) {
      setLoginError(true);
      return;
    }

    setLoginError(false);
    let name;
    try {
      const cachedName = localStorage.getItem('codename');
      name = cachedName || generateCodename();
=======
  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem('loginEmail') || '';
    } catch {
      return '';
    }
  });
  const [password, setPassword] = useState('');
  const [codename, setCodename] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem('loginTheme') === 'dark';
    } catch {
      return false;
    }
  });

  document.documentElement.dataset.theme = isDarkMode ? 'dark' : 'light';

  function toggleTheme() {
    const nextIsDark = !isDarkMode;
    setIsDarkMode(nextIsDark);
    try {
      localStorage.setItem('loginTheme', nextIsDark ? 'dark' : 'light');
    } catch {
      // Teeman vaihto toimii myös ilman Local Storagea.
    }
  }

  function handleLogin(event) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    try {
      // Muistetaan sähköposti, mutta salasanaa ei koskaan tallenneta selaimeen.
      localStorage.setItem('loginEmail', normalizedEmail);
      const codenameKey = `codename:${normalizedEmail}`;
      const cachedName = localStorage.getItem(codenameKey);
      const name = cachedName || generateCodename();
>>>>>>> origin/main

      if (!cachedName) {
        localStorage.setItem(codenameKey, name);
      }

      setStorageError(false);
    } catch {
<<<<<<< HEAD
      name = generateCodename();
      setStorageError(true);
    }

    setCodename(name);
    setUserEmail(DEMO_CREDENTIALS.email);
=======
      setCodename(generateCodename());
      setStorageError(true);
    }

    setEmail(normalizedEmail);
>>>>>>> origin/main
    setPassword('');
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
<<<<<<< HEAD
    setEmail('');
    setPassword('');
    setUserEmail('');
    setLoginError(false);
  }

  return (
    <main className="app-shell">
      {isLoggedIn ? (
        <section className="welcome-screen" aria-live="polite">
          <h1>Tervetuloa!</h1>
          <p className="welcome-label">Olet kirjautunut sisään käyttäjänä:</p>
          <p className="user-email">{userEmail}</p>
          <h2>Koodinimesi:</h2>
          <p className="codename">{codename}</p>
          {storageError && (
            <p className="notice">
              Koodinimeä ei voitu tallentaa selaimen muistiin.
            </p>
          )}
          <button
            type="button"
            className="new-codename-button"
            onClick={handleNewCodename}
          >
            Luo uusi koodinimi!
          </button>
          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Kirjaudu ulos
          </button>
        </section>
      ) : (
        <section className="login-screen">
          <h1>Kirjaudu sisään</h1>
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
            <button type="submit" className="login-button">Kirjaudu</button>
          </form>
        </section>
      )}
    </main>
=======
    setPassword('');
  }

  return React.createElement(
    'main',
    { className: 'card' },
    React.createElement(
      'button',
      {
        type: 'button',
        className: 'theme-toggle',
        onClick: toggleTheme,
        'aria-label': isDarkMode ? 'Vaihda vaaleaan teemaan' : 'Vaihda tummaan teemaan',
      },
      isDarkMode ? '☀️ Vaalea teema' : '🌙 Tumma teema'
    ),
    isLoggedIn
      ? React.createElement(
          React.Fragment,
          null,
          React.createElement('h1', null, 'Tervetuloa!'),
          React.createElement(
            'section',
            { className: 'welcome', 'aria-live': 'polite' },
            React.createElement('p', { className: 'welcome-label' }, 'Koodinimesi on'),
            React.createElement('p', { className: 'codename' }, codename),
            storageError
              ? React.createElement('p', { className: 'notice' }, 'Selain esti tallennuksen. Koodinimeä ei voitu tallentaa.')
              : React.createElement('p', { className: 'saved' }, '✓ Koodinimi tallennettu selaimeen'),
            React.createElement('button', { type: 'button', className: 'secondary-button', onClick: handleLogout }, 'Kirjaudu ulos')
          )
        )
      : React.createElement(
          React.Fragment,
          null,
          React.createElement('h1', null, 'Firebase Login Demo'),
          React.createElement('h2', { className: 'login-heading' }, 'Kirjaudu sisään'),
          React.createElement(
            'form',
            { className: 'login-form', onSubmit: handleLogin },
            React.createElement(
              'label',
              { className: 'field-row' },
              React.createElement('span', null, 'Sähköposti'),
              React.createElement('input', {
                type: 'email',
                name: 'email',
                autoComplete: 'email',
                value: email,
                onChange: (event) => setEmail(event.target.value),
                required: true,
              })
            ),
            React.createElement(
              'label',
              { className: 'field-row' },
              React.createElement('span', null, 'Salasana'),
              React.createElement('input', {
                type: 'password',
                name: 'password',
                autoComplete: 'current-password',
                value: password,
                onChange: (event) => setPassword(event.target.value),
                required: true,
              })
            ),
            React.createElement('button', { type: 'submit', className: 'login-button' }, 'Kirjaudu')
          ),
          React.createElement(
            'p',
            { className: 'privacy-note' },
            'Demo ei tarkista tunnuksia Firebase-palvelusta. Sähköposti muistetaan tällä selaimella; salasanaa ei tallenneta.'
          )
        )
>>>>>>> origin/main
  );
}

createRoot(document.getElementById('root')).render(<App />);
