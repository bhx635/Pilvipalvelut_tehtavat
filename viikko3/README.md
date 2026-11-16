# Viikko 3 – Vite + React ja Local Storage

React-sovellus arpoo kirjautuvalle käyttäjälle hauskan koodinimen. Nimi tallennetaan selaimen Local Storageen avaimella `codename`, ja samalla selaimella kirjautuessa käytetään aiemmin tallennettua nimeä. Kirjautumisnäkymä ja demotunnukset noudattavat viikon 4 projektin mallia.

## Demotunnukset

- Tunnus: `testi@esimerkki.fi`
- Salasana: `ss123`

Kirjautuminen on selainkoodissa toimiva demo, ei oikea tunnistautuminen Firebase-palveluun. Tunnukset ovat julkisia eikä niitä pidä käyttää muissa palveluissa.

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
