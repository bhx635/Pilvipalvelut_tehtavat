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
  const [codename, setCodename] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [storageError, setStorageError] = useState(false);

  function handleLogin() {
    try {
      const cachedName = localStorage.getItem('codename');
      const name = cachedName || generateCodename();

      if (!cachedName) {
        localStorage.setItem('codename', name);
      }

      setCodename(name);
      setStorageError(false);
    } catch {
      // Näytetään silti koodinimi, vaikka selain estäisi Local Storagen.
      setCodename(generateCodename());
      setStorageError(true);
    }

    setIsLoggedIn(true);
  }

  function handleLogout() {
    setIsLoggedIn(false);
  }

  return React.createElement(
    'main',
    { className: 'card' },
    React.createElement('span', { className: 'eyebrow' }, 'VIIKKOTEHTÄVÄ 4'),
    React.createElement('div', { className: 'icon', 'aria-hidden': 'true' }, '✦'),
    React.createElement('h1', null, 'Koodinimigeneraattori'),
    React.createElement(
      'p',
      { className: 'intro' },
      'Kirjaudu sisään ja saat itsellesi hauskan koodinimen. Se tallennetaan selaimeesi seuraavaa kertaa varten.'
    ),
    isLoggedIn
      ? React.createElement(
          'section',
          { className: 'welcome', 'aria-live': 'polite' },
          React.createElement('p', { className: 'welcome-label' }, 'Tervetuloa, koodinimesi on'),
          React.createElement('p', { className: 'codename' }, codename),
          storageError
            ? React.createElement(
                'p',
                { className: 'notice' },
                'Selain esti Local Storagen käytön. Koodinimeä ei voitu tallentaa.'
              )
            : React.createElement('p', { className: 'saved' }, '✓ Tallennettu selaimen Local Storageen'),
          React.createElement(
            'button',
            { type: 'button', className: 'secondary-button', onClick: handleLogout },
            'Kirjaudu ulos'
          )
        )
      : React.createElement(
          'button',
          { type: 'button', className: 'login-button', onClick: handleLogin },
          'Kirjaudu sisään'
        ),
    React.createElement(
      'footer',
      null,
      'Koodinimi tallennetaan selaimen Local Storageen avaimella ',
      React.createElement('code', null, 'codename'),
      '.'
    )
  );
}

createRoot(document.getElementById('root')).render(React.createElement(App));
