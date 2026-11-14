import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

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

      if (!cachedName) {
        localStorage.setItem(codenameKey, name);
      }

      setCodename(name);
      setStorageError(false);
    } catch {
      setCodename(generateCodename());
      setStorageError(true);
    }

    setEmail(normalizedEmail);
    setPassword('');
    setIsLoggedIn(true);
  }

  function handleLogout() {
    setIsLoggedIn(false);
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
  );
}

createRoot(document.getElementById('root')).render(React.createElement(App));
