import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import { QuizForm } from "./components/QuizForm";
import { clearPlayers, joinSession, subscribeToSession } from "./gameSessionService";
import { isFirestoreConfigured } from "./firebase";
import { nextRound, resetGame, startGameIfPossible, submitGuess } from "./gameController";
import { type Session } from "./types/Session";
import { createInitialSession } from "./gameSessionService";

const players = [
  { email: "pelaaja@yksi.fi", password: "ss123", uid: "pelaaja-yksi", codename: "HiljainenLisko" },
  { email: "pelaaja@kaksi.fi", password: "ss456", uid: "pelaaja-kaksi", codename: "UteliasKettu" },
];

type ConnectionState = "connecting" | "connected" | "local" | "error";

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function App() {
  const [session, setSession] = useState<Session>(() => createInitialSession());
  const [user, setUser] = useState<{ uid: string; codename: string } | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [connection, setConnection] = useState<ConnectionState>(
    isFirestoreConfigured ? "connecting" : "local",
  );

  useEffect(() => subscribeToSession(
    (nextSession) => {
      setSession(nextSession);
      if (isFirestoreConfigured) setConnection("connected");
    },
    (cause) => {
      setError(`Pelitilan synkronointi epäonnistui: ${cause.message}`);
      if (isFirestoreConfigured) setConnection("error");
    },
  ), []);

  useEffect(() => {
    if (!loggedIn || !user || session.status !== "waiting") return;
    if (session.players.some((player) => player.uid === user.uid)) return;

    void joinSession({ uid: user.uid, codename: user.codename, score: 0, guess: null })
      .then(setSession)
      .catch((cause: unknown) => setError(errorMessage(cause, "Peliin liittyminen epäonnistui.")));
  }, [loggedIn, user, session.status, session.players]);

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
      setError("");
      setSession(await startGameIfPossible());
    } catch (cause) {
      setError(errorMessage(cause, "Pelin käynnistys epäonnistui."));
    }
  }

  async function clearWaitingPlayers() {
    try {
      setError("");
      setSession(await clearPlayers());
    } catch (cause) {
      setError(errorMessage(cause, "Pelaajien tyhjennys epäonnistui."));
    }
  }

  async function submitPlayerGuess(guess: number) {
    if (!user) return;
    try {
      setError("");
      setSession(await submitGuess(user.uid, guess));
    } catch (cause) {
      setError(errorMessage(cause, "Arvauksen tallennus epäonnistui."));
    }
  }

  async function advanceRound() {
    try {
      setError("");
      setSession(await nextRound(session));
    } catch (cause) {
      setError(errorMessage(cause, "Kierroksen vaihtaminen epäonnistui."));
    }
  }

  async function restartGame() {
    try {
      setError("");
      setSession(await resetGame());
    } catch (cause) {
      setError(errorMessage(cause, "Pelin uudelleenaloitus epäonnistui."));
    }
  }

  return (
    <main className="app-shell">
      <p className={`connection-status connection-${connection}`} role="status">
        {connection === "connected"
          ? "Firestore-yhteys käytössä"
          : connection === "connecting"
            ? "Yhdistetään Firestoreen..."
            : connection === "error"
              ? "Firestore-yhteys ei ole käytettävissä"
              : "Paikallinen tila — Firestore-asetuksia ei ole määritetty"}
      </p>
      {!loggedIn ? (
        <section className="login-screen">
          <h1>Kirjaudu peliin</h1>
          <p className="login-help">
            Testitunnukset: pelaaja@yksi.fi / ss123 tai pelaaja@kaksi.fi / ss456
          </p>
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
          {error && <p className="game-error" role="alert">{error}</p>}

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
                <p>Pelaajia nyt: {session.players.length} / 4 (aloitukseen tarvitaan vähintään 2)</p>
                <button onClick={clearWaitingPlayers}>Tyhjennä pelaajat</button>
                <button onClick={start} disabled={session.players.length < 2}>Aloita peli</button>
              </>
            )}

            {session.status === "playing" && (
              session.players.some((player) => player.uid === user.uid) ? (
                <QuizForm
                  players={session.players}
                  currentUserId={user.uid}
                  currentProduct={session.currentProduct}
                  correctPrice={session.correctPrice}
                  onSubmitGuess={submitPlayerGuess}
                  onNextRound={advanceRound}
                />
              ) : (
                <p>Peli on käynnissä. Voit liittyä seuraavaan peliin sen päätyttyä.</p>
              )
            )}

            {session.status === "finished" && (
              <div>
                <h2>Peli päättyi</h2>
                <p>Voittaja: {session.winnerCodename ?? "ei määritetty"}</p>
                <button onClick={restartGame}>Aloita alusta</button>
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
