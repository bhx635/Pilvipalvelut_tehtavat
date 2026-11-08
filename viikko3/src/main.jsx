import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

const adjectives = [
  'Sneaky', 'Cosmic', 'Mighty', 'Bouncy', 'Clever',
  'Sleepy', 'Fuzzy', 'Ninja', 'Happy', 'Electric'
];

const animals = [
  'Panda', 'Fox', 'Penguin', 'Otter', 'Dragon',
  'Raccoon', 'Koala', 'Llama', 'Badger', 'Unicorn'
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
      // Käytetään vanhaa koodinimeä, jos se löytyy; muuten luodaan ja tallennetaan uusi.
      const cachedName = localStorage.getItem('codename');
      const name = cachedName || generateCodename();
      if (!cachedName) {
        localStorage.setItem('codename', name);
      }
      setCodename(name);
      setStorageError(false);
    } catch (error) {
      // Sovellus toimii myös, jos selain estää Local Storagen käytön.
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
    React.createElement('span', { className: 'eyebrow' }, 'VIIKKOTEHTÄVÄ 3'),
    React.createElement('h1', null, 'Koodinimigeneraattori'),
    React.createElement(
      'p',
      { className: 'intro' },
      'Kirjaudu sisään ja saat hauskan koodinimen. Nimesi säilyy tällä selaimella myös seuraavaa kertaa varten.'
    ),
    isLoggedIn
      ? React.createElement(
          'section',
          { className: 'welcome', 'aria-live': 'polite' },
          React.createElement('span', { className: 'sparkle', 'aria-hidden': 'true' }, '✦'),
          React.createElement('p', { className: 'welcome-label' }, 'Tervetuloa, sinun koodinimesi on'),
          React.createElement('p', { className: 'codename' }, codename),
          storageError
            ? React.createElement('p', { className: 'notice' }, 'Selain ei sallinut Local Storagen käyttöä, joten nimeä ei voitu tallentaa.')
            : React.createElement('p', { className: 'saved' }, '✓ Tallennettu Local Storageen'),
          React.createElement('button', { type: 'button', className: 'secondary-button', onClick: handleLogout }, 'Kirjaudu ulos')
        )
      : React.createElement(
          'button',
          { type: 'button', className: 'login-button', onClick: handleLogin },
          'Kirjaudu sisään'
        ),
    React.createElement('footer', null, 'Koodinimi tallennetaan selaimen Local Storageen avaimella “codename”.')
  );
}

createRoot(document.getElementById('root')).render(React.createElement(App));
