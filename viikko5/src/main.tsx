import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import { QuizForm } from "./components/QuizForm";
import { clearPlayers, getStoredSession, joinSession, saveSession } from "./gameSessionService";
import { nextRound, resetGame, startGameIfPossible, submitGuess } from "./gameController";
import { type Session } from "./types/Session";

const adjectives = ["Hiljainen", "Utelias", "Nopea", "Viisas", "Rohkea"];
const animals = ["Lisko", "Kettu", "Panda", "Pöllö", "Saukko"];

function createUser() {
  const suffix = crypto.randomUUID().slice(0, 8);
  const codename = `${adverbs(adjectives)}${adverbs(animals)}${suffix}`;
  return { uid: suffix, codename };
}

function adverbs(values: string[]) {
  return values[Math.floor(Math.random() * values.length)];
}

function App() {
  const [session, setSession] = useState<Session>(() => getStoredSession());
  const [user] = useState(() => {
    const stored = sessionStorage.getItem("hintavisa-user");
    if (stored) return JSON.parse(stored) as { uid: string; codename: string };
    const user = createUser();
    sessionStorage.setItem("hintavisa-user", JSON.stringify(user));
    return user;
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const sync = () => setSession(getStoredSession());
    window.addEventListener("storage", sync);
    const channel = new BroadcastChannel("hintavisa");
    channel.onmessage = sync;
    return () => {
      window.removeEventListener("storage", sync);
      channel.close();
    };
  }, []);

  useEffect(() => {
    if (loggedIn && session.status === "waiting") {
      const next = joinSession({ uid: user.uid, codename: user.codename, score: 0, guess: null });
      setSession(next);
    }
  }, [loggedIn, user, session.status]);

  function login(event: React.FormEvent) {
    event.preventDefault();
    if (!email.includes("@") || password.length < 3) {
      setError("Anna sähköposti ja vähintään 3 merkin salasana.");
      return;
    }
    setError("");
    setLoggedIn(true);
  }

  async function start() {
    try {
      await startGameIfPossible(session);
      setSession(getStoredSession());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pelin käynnistys epäonnistui.");
    }
  }

  return (
    <main className="app-shell">
      <h1>Hintavisa</h1>
      {!loggedIn ? (
        <section className="login-card">
          <h2>Kirjaudu peliin</h2>
          <form onSubmit={login}>
            <label htmlFor="email">Sähköposti</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <label htmlFor="password">Salasana</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <p role="alert">{error}</p>}
            <button type="submit">Kirjaudu</button>
          </form>
        </section>
      ) : (
        <>
          <p>Olet kirjautunut nimellä <strong>{user.codename}</strong></p>
          <button onClick={() => setLoggedIn(false)}>Kirjaudu ulos</button>
          {error && <p role="alert">{error}</p>}

          <section className="game-card">
            <h2>{session.sessionName}</h2>
            <p>Tila: {session.status === "waiting" ? "odottaa" : session.status === "playing" ? "pelaamassa" : "päättynyt"}</p>
            <p>Kierros: {session.currentRound} / {session.maxRounds}</p>

            <h3>Pelaajat</h3>
            <ul>
              {session.players.map((player) => (
                <li key={player.uid}>{player.codename} — pisteet: {player.score}</li>
              ))}
            </ul>

            {session.status === "waiting" && (
              <>
                <p>Pelaajia nyt: {session.players.length} / 4</p>
                <button onClick={() => setSession(clearPlayers())}>Tyhjennä pelaajat</button>
                <button onClick={start} disabled={session.players.length < 2}>Aloita peli</button>
              </>
            )}

            {session.status === "playing" && (
              <QuizForm
                players={session.players}
                currentUserId={user.uid}
                currentProduct={session.currentProduct}
                correctPrice={session.correctPrice}
                onSubmitGuess={(guess) => {
                  submitGuess(user.uid, guess);
                  setSession(getStoredSession());
                }}
                onNextRound={async () => {
                  await nextRound();
                  setSession(getStoredSession());
                }}
              />
            )}

            {session.status === "finished" && (
              <div>
                <h2>Peli päättyi</h2>
                <p>Voittaja: {session.winnerCodename}</p>
                <button onClick={() => setSession(resetGame())}>Aloita alusta</button>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode><App /></StrictMode>
);
