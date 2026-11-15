# Viikko 4 – Kirjautuminen ja koodinimi

Sovelluksessa on kirjautumisvalikko sähköpostille ja salasanalle. Oikeilla demotunnuksilla käyttäjän sähköposti ja koodinimi näytetään tervetulonäkymässä. Koodinimi tallennetaan selaimen Local Storageen `codename`-avaimella, ja sen voi vaihtaa **Luo uusi koodinimi!** -painikkeesta.

## Demotunnukset

- Tunnus: `testi@esimerkki.fi`
- Salasana: `ss123`

Tämä on julkinen käyttöliittymädemo, ei oikea tunnistautuminen. Tunnukset ovat sovelluksen selainkoodissa kaikkien nähtävissä, eikä salasanaa tarkisteta palvelimella tai lähetetä eteenpäin. Salasanaa ei tallenneta selaimen muistiin. Älä käytä näitä tunnuksia oikeissa palveluissa.

## Käynnistä kehitystilassa

```bash
npm install
npm run dev
```

## Rakenna ja esikatsele julkaisuversio

```bash
npm run build
npm run preview
```

