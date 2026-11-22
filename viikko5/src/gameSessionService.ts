import { type Player } from "./types/Player";
import { type Session } from "./types/Session";

const STORAGE_KEY = "viikko5-game-session";

const initialSession = (): Session => ({
  id: "hintavisa",
  sessionName: "Hintavisa",
  status: "waiting",
  players: [],
  currentRound: 0,
  maxRounds: 3,
  currentProduct: null,
  correctPrice: null,
  winnerCodename: null,
});

export function getStoredSession(): Session {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) as Session : initialSession();
  } catch {
    return initialSession();
  }
}

export function saveSession(session: Session): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  const channel = new BroadcastChannel("hintavisa");
  channel.postMessage(session);
  channel.close();
  window.dispatchEvent(new StorageEvent("storage", {
    key: STORAGE_KEY,
    newValue: JSON.stringify(session),
  }));
}

export function joinSession(player: Player): Session {
  const session = getStoredSession();
  if (!session.players.some((item) => item.uid === player.uid) && session.players.length < 4) {
    session.players = [...session.players, player];
  }
  saveSession(session);
  return session;
}

export function clearPlayers(): Session {
  const session = getStoredSession();
  session.players = [];
  session.status = "waiting";
  session.currentRound = 0;
  session.currentProduct = null;
  session.correctPrice = null;
  session.winnerCodename = null;
  saveSession(session);
  return session;
}
