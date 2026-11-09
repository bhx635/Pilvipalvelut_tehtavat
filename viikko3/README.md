# Viikko 3 – Vite + React ja Local Storage

Pieni Vite-pohjainen React-sovellus arpoo kirjautuvalle käyttäjälle hauskan koodinimen. Koodinimi tallennetaan selaimen Local Storageen avaimella `codename`, ja samalla selaimella myöhemmin kirjautuessa käytetään aiemmin tallennettua nimeä.

## Käynnistä kehitystilassa

Avaa terminaali tässä kansiossa (`viikko3`) ja suorita:

```bash
npm install
npm run dev
```

Avaa terminaalin ilmoittama osoite selaimessa (yleensä `http://localhost:5173`).

## Rakenna julkaistava versio

```bash
npm run build
npm run preview
```

React-komponentti, koodinimen generointi ja Local Storage -käsittely ovat tiedostossa `src/main.jsx`. Vite käsittelee Reactin ja CSS:n buildin yhteydessä.
