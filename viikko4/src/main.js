import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

const h = React.createElement;

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
      email.trim().toLowerCase() !== DEMO_CREDENTIALS.email ||
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

      if (!cachedName) {
        localStorage.setItem('codename', name);
      }

      setStorageError(false);
    } catch {
      name = generateCodename();
      setStorageError(true);
    }

    setCodename(name);
    setUserEmail(DEMO_CREDENTIALS.email);
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
    setEmail('');
    setPassword('');
    setUserEmail('');
    setLoginError(false);
  }

  function renderWelcome() {
    return h(
      'section',
      { className: 'welcome-screen', 'aria-live': 'polite' },
      h('h1', null, 'Tervetuloa!'),
      h('p', { className: 'welcome-label' }, 'Olet kirjautunut sisään käyttäjänä:'),
      h('p', { className: 'user-email' }, userEmail),
      h('h2', null, 'Koodinimesi:'),
      h('p', { className: 'codename' }, codename),
      storageError
        ? h('p', { className: 'notice' }, 'Koodinimeä ei voitu tallentaa selaimen muistiin.')
        : null,
      h(
        'button',
        { type: 'button', className: 'new-codename-button', onClick: handleNewCodename },
        'Luo uusi koodinimi!'
      ),
      h(
        'button',
        { type: 'button', className: 'logout-button', onClick: handleLogout },
        'Kirjaudu ulos'
      )
    );
  }

  function renderLogin() {
    return h(
      'section',
      { className: 'login-screen' },
      h('h1', null, 'Kirjaudu sisään'),
      h(
        'form',
        { className: 'login-form', onSubmit: handleLogin },
        h(
          'div',
          { className: 'field-row' },
          h('label', { htmlFor: 'email' }, 'Sähköposti'),
          h('input', {
            autoComplete: 'username',
            id: 'email',
            name: 'email',
            onChange: (event) => {
              setEmail(event.target.value);
              setLoginError(false);
            },
            required: true,
            type: 'email',
            value: email,
          })
        ),
        h(
          'div',
          { className: 'field-row' },
          h('label', { htmlFor: 'password' }, 'Salasana'),
          h('input', {
            autoComplete: 'current-password',
            id: 'password',
            name: 'password',
            onChange: (event) => {
              setPassword(event.target.value);
              setLoginError(false);
            },
            required: true,
            type: 'password',
            value: password,
          })
        ),
        loginError
          ? h('p', { className: 'login-error', role: 'alert' }, 'Virheellinen sähköposti tai salasana.')
          : null,
        h('button', { type: 'submit', className: 'login-button' }, 'Kirjaudu')
      )
    );
  }

  return h('main', { className: 'app-shell' }, isLoggedIn ? renderWelcome() : renderLogin());
}

createRoot(document.getElementById('root')).render(h(App));
