# Viikko 3 – Vite + React ja Local Storage

React-sovellus arpoo hauskan koodinimen, jonka se tallentaa Local Storageen avaimella `codename`, kun käyttäjä kirjautuu sisään. Ulos- ja uudelleenkirjautuessa sama nimi haetaan selaimesta. Käyttöliittymä noudattaa sivulla olevaa näyttökuvaa.

Kirjautuminen on tehtävän käyttöliittymädemo, ei oikea Firebase-tunnistautuminen. Viikon 4 projektissa ei ole Firebase-asetuksia. GitHub Pages julkaisee tällä hetkellä lähdekansion, joten selain lataa Reactin import mapin kautta.

## Käynnistä kehitystilassa

```bash
npm install
npm run dev
```

## Rakenna julkaistava versio

```bash
npm run build
npm run preview
```

React-lähdekoodi ja tyylit ovat `src/`-kansiossa. Vite niputtaa riippuvuudet tuotantobuildiin; selain voi myös ladata lähdekoodin suoraan GitHub Pagesista.
