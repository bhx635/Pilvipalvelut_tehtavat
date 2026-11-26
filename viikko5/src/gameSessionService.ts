import { signInAnonymously } from "firebase/auth";
import {
  doc,
  onSnapshot,
  runTransaction,
} from "firebase/firestore";
import { authentication, database } from "./firebase";
import { type Player } from "./types/Player";
import { type Session } from "./types/Session";

const STORAGE_KEY = "viikko5-game-session";
const SESSION_ID = "hintavisa";
let signInPromise: Promise<void> | null = null;

export const createInitialSession = (): Session => ({
  id: SESSION_ID,
  sessionName: "Hintavisa",
  status: "waiting",
  players: [],
  currentRound: 0,
  maxRounds: 3,
  currentProduct: null,
  correctPrice: null,
  winnerCodename: null,
});

function isSession(value: unknown): value is Session {
  if (!value || typeof value !== "object") return false;
  const session = value as Partial<Session>;
  return (
    typeof session.id === "string" &&
    typeof session.sessionName === "string" &&
    ["waiting", "playing", "finished"].includes(session.status ?? "") &&
    Array.isArray(session.players) &&
    Number.isInteger(session.currentRound) &&
    Number.isInteger(session.maxRounds) &&
    (session.currentProduct === null || typeof session.currentProduct === "object") &&
    (session.correctPrice === null || typeof session.correctPrice === "number") &&
    (session.winnerCodename === null || typeof session.winnerCodename === "string")
  );
}

function parseSession(value: unknown): Session {
  if (!isSession(value)) throw new Error("Tallennettu pelitila on virheellinen.");
  return value;
}

function sessionReference() {
  if (!database) throw new Error("Firestorea ei ole määritetty.");
  return doc(database, "gameSessions", SESSION_ID);
}

async function ensureSignedIn(): Promise<void> {
  if (!authentication || authentication.currentUser) return;
  if (!signInPromise) {
    signInPromise = signInAnonymously(authentication)
      .then(() => undefined)
      .finally(() => {
        signInPromise = null;
      });
  }
  await signInPromise;
}

export function subscribeToSession(
  onSession: (session: Session) => void,
  onError: (error: Error) => void,
): () => void {
  if (database && authentication) {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    void ensureSignedIn()
      .then(() => {
        if (cancelled) return;
        unsubscribe = onSnapshot(
          sessionReference(),
          (snapshot) => {
            try {
              onSession(snapshot.exists()
                ? parseSession(snapshot.data())
                : createInitialSession());
            } catch (error) {
              onError(error instanceof Error ? error : new Error("Pelitilan lukeminen epäonnistui."));
            }
          },
          (error) => onError(error),
        );
      })
      .catch((error: unknown) => {
        onError(error instanceof Error ? error : new Error("Kirjautuminen Firestoreen epäonnistui."));
      });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }

  const syncFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      onSession(stored ? parseSession(JSON.parse(stored) as unknown) : createInitialSession());
    } catch (error) {
      onError(error instanceof Error ? error : new Error("Paikallisen pelitilan lukeminen epäonnistui."));
    }
  };

  const channel = new BroadcastChannel("hintavisa");
  channel.onmessage = (event: MessageEvent<unknown>) => {
    try {
      onSession(parseSession(event.data));
    } catch (error) {
      onError(error instanceof Error ? error : new Error("Pelitilan vastaanotto epäonnistui."));
    }
  };
  window.addEventListener("storage", syncFromStorage);
  syncFromStorage();

  return () => {
    window.removeEventListener("storage", syncFromStorage);
    channel.close();
  };
}

function saveLocalSession(session: Session): void {
  const serialized = JSON.stringify(session);
  localStorage.setItem(STORAGE_KEY, serialized);
  const channel = new BroadcastChannel("hintavisa");
  channel.postMessage(session);
  channel.close();
  window.dispatchEvent(new StorageEvent("storage", {
    key: STORAGE_KEY,
    newValue: serialized,
  }));
}

export async function updateSession(
  update: (session: Session) => Session,
): Promise<Session> {
  if (!database || !authentication) {
    const stored = localStorage.getItem(STORAGE_KEY);
    const current = stored ? parseSession(JSON.parse(stored) as unknown) : createInitialSession();
    const next = update(current);
    saveLocalSession(next);
    return next;
  }

  await ensureSignedIn();
  return runTransaction(database, async (transaction) => {
    const snapshot = await transaction.get(sessionReference());
    const current = snapshot.exists()
      ? parseSession(snapshot.data())
      : createInitialSession();
    const next = update(current);
    transaction.set(sessionReference(), next);
    return next;
  });
}

export function joinSession(player: Player): Promise<Session> {
  return updateSession((session) => {
    if (session.status !== "waiting") throw new Error("Peli on jo käynnissä.");
    if (session.players.some((item) => item.uid === player.uid)) return session;
    if (session.players.length >= 4) throw new Error("Peliin mahtuu enintään 4 pelaajaa.");
    return { ...session, players: [...session.players, player] };
  });
}

export function clearPlayers(): Promise<Session> {
  return updateSession((session) => {
    if (session.status !== "waiting") throw new Error("Pelaajia voi tyhjentää vain ennen peliä.");
    return {
      ...session,
      players: [],
      currentRound: 0,
      currentProduct: null,
      correctPrice: null,
      winnerCodename: null,
    };
  });
}
