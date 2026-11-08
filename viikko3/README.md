# Viikko 3 – Vite + React ja Local Storage

Pieni React-sovellus arpoo kirjautuvalle käyttäjälle hauskan koodinimen. Koodinimi tallennetaan selaimen Local Storageen avaimella `codename`, ja samalla selaimella kirjautuessa käytetään aiemmin tallennettua nimeä.

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

Sovelluksen React-lähdekoodi ja tyylit ovat `src/`-kansiossa. `index.html` sisältää myös selaimessa käytettävän React-import mapin, joten tehtävä toimii GitHub Pagesissa tästä kansiosta.
