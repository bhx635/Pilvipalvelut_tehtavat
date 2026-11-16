# Viikko 3 – Vite + React ja Local Storage

React-sovellus arpoo hauskan koodinimen, jonka se tallentaa Local Storageen avaimella `codename`, kun käyttäjä kirjautuu sisään. Ulos- ja uudelleenkirjautuessa sama nimi haetaan selaimesta. Käyttöliittymä noudattaa sivulla olevaa näyttökuvaa.

Kirjautuminen on tehtävän käyttöliittymädemo, ei oikea Firebase-tunnistautuminen. Viikon 4 projektissa ei ole Firebase-asetuksia.

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

React-lähdekoodi ja tyylit ovat `src/`-kansiossa. Vite niputtaa React-riippuvuudet julkaisuversioon, joten sovellus ei tarvitse selaimessa ladattavaa React-import mapia.
