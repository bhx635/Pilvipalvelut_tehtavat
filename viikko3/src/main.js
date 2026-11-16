import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

const h = React.createElement;

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
  const [codename, setCodename] = useState(generateCodename);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [storageError, setStorageError] = useState(false);

  function handleLogin() {
    let name;

    try {
      const cachedName = localStorage.getItem('codename');
      name = cachedName || codename;
      if (!cachedName) {
        localStorage.setItem('codename', name);
      }
      setStorageError(false);
    } catch {
      name = codename;
      setStorageError(true);
    }

    setCodename(name);
    setIsLoggedIn(true);
  }

  function handleLogout() {
    setIsLoggedIn(false);
  }

  return h(
    'main',
    { className: 'app-shell' },
    h('h1', null, 'Koodinimisovellus'),
    h(
      'button',
      {
        type: 'button',
        onClick: isLoggedIn ? handleLogout : handleLogin,
      },
      isLoggedIn ? 'Kirjaudu ulos' : 'Kirjaudu sisään'
    ),
    h('p', { className: 'codename', 'aria-live': 'polite' }, 'Koodinimesi on ', codename),
    storageError
      ? h(
          'p',
          { className: 'notice', role: 'status' },
          'Nimeä ei voitu tallentaa selaimen Local Storageen.'
        )
      : null
  );
}

createRoot(document.getElementById('root')).render(h(App));
