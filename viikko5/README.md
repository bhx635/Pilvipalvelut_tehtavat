# Hintavisa (viikko 5)

The app uses DummyJSON for products and Firestore for shared game state when Firebase is configured. Without Firebase settings, it runs in local browser storage mode; that mode synchronizes only between tabs in the same browser.

## Firebase setup

1. Create a Firebase project, register a web app, enable **Authentication → Anonymous**, and create a Firestore database.
2. Deploy [firestore.rules](./firestore.rules) to the project. These permissive rules are for this small class exercise only; they do not protect scores from modified clients and are not suitable for a production game.
3. Copy `.env.example` to `.env.local` and fill in the Firebase web app's API key, auth domain, project ID, and app ID.
4. Run `npm run dev` or build the app with `npm run build`.

GitHub Pages builds need the same four values at build time. Add them as repository or `github-pages` environment secrets named `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, and `VITE_FIREBASE_APP_ID`. Firebase web app configuration is included in client-side output; configure Firebase security rules and API-key restrictions appropriately.

## Game

Use either of the displayed test accounts. The game supports 2–4 players and three rounds. Each guess earns up to 100 points based on how close it is proportionally to the product price; the final winner is the player with the highest total score.
