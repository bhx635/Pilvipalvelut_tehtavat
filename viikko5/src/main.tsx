import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import { QuizForm } from "./components/QuizForm";
import { clearPlayers, getStoredSession, joinSession } from "./gameSessionService";
import { nextRound, resetGame, startGameIfPossible, submitGuess } from "./gameController";
import { type Session } from "./types/Session";

const players = [
  { email: "pelaaja@yksi.fi", password: "ss123", uid: "pelaaja-yksi", codename: "HiljainenLisko" },
  { email: "pelaaja@kaksi.fi", password: "ss456", uid: "pelaaja-kaksi", codename: "UteliasKettu" },
];

function App() {
  const [session, setSession] = useState<Session>(() => getStoredSession());
  const [user, setUser] = useState<{ uid: string; codename: string } | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const sync = () => setSession(getStoredSession());
    window.addEventListener("storage", sync);
    const channel = new BroadcastChannel("hintavisa");
    channel.onmessage = (event) => {
      setSession(event.data as Session);
    };
    return () => {
      window.removeEventListener("storage", sync);
      channel.close();
    };
  }, []);

  useEffect(() => {
    if (loggedIn && user && session.status === "waiting") {
      const next = joinSession({ uid: user.uid, codename: user.codename, score: 0, guess: null });
      setSession(next);
    }
  }, [loggedIn, user, session.status]);

  function login(event: React.FormEvent) {
    event.preventDefault();
    const player = players.find(
      (item) => item.email === email.trim().toLowerCase() && item.password === password
    );
    if (!player) {
      setError("Virheellinen sähköposti tai salasana.");
      return;
    }
    setUser({ uid: player.uid, codename: player.codename });
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
      {!loggedIn ? (
        <section className="login-screen">
          <h1>Kirjaudu peliin</h1>
          <form className="login-form" onSubmit={login}>
            <div className="field-row">
              <label htmlFor="email">Sähköposti</label>
              <input
                autoComplete="username"
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                }}
                required
              />
            </div>
            <div className="field-row">
              <label htmlFor="password">Salasana</label>
              <input
                autoComplete="current-password"
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                required
              />
            </div>
            {error && <p className="login-error" role="alert">{error}</p>}
            <button type="submit" className="login-button">Kirjaudu</button>
          </form>
        </section>
      ) : user ? (
        <>
          <p>Olet kirjautunut nimellä <strong>{user.codename}</strong></p>
          <button onClick={() => {
            setLoggedIn(false);
            setUser(null);
            setEmail("");
            setPassword("");
          }}>Kirjaudu ulos</button>
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
      ) : null}
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode><App /></StrictMode>
);
