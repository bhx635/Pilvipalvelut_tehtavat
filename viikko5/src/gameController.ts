import { clearPlayers, getStoredSession, saveSession } from "./gameSessionService";
import { type Product } from "./types/Product";
import { type Session } from "./types/Session";

export async function fetchRandomProduct(): Promise<Product> {
  const response = await fetch("https://dummyjson.com/products");
  if (!response.ok) throw new Error("Tuotteiden haku epäonnistui");
  const data = await response.json();
  const products = data.products as Product[];
  return products[Math.floor(Math.random() * products.length)];
}

export async function startGameIfPossible(session: Session): Promise<void> {
  if (session.players.length < 2) throw new Error("Peliin tarvitaan vähintään 2 pelaajaa");
  const product = await fetchRandomProduct();
  const next: Session = {
    ...session,
    status: "playing",
    currentRound: 1,
    currentProduct: product,
    correctPrice: null,
    players: session.players.map((player) => ({ ...player, guess: null })),
  };
  saveSession(next);
}

export function submitGuess(uid: string, guess: number): void {
  const session = getStoredSession();
  session.players = session.players.map((player) =>
    player.uid === uid && player.guess === null ? { ...player, guess } : player
  );
  const guessed = session.players.filter((player) => player.guess !== null).length;
  if (guessed === session.players.length && session.currentProduct) {
    session.correctPrice = session.currentProduct.price;
    session.players = session.players.map((player) => {
      if (player.guess === null) return player;
      const points = Math.max(0, 100 - Math.abs(player.guess - session.correctPrice!));
      return { ...player, score: player.score + points };
    });
  }
  saveSession(session);
}

export async function nextRound(): Promise<void> {
  const session = getStoredSession();
  if (session.correctPrice === null) return;
  if (session.currentRound >= session.maxRounds) {
    const winner = [...session.players].sort((a, b) => b.score - a.score)[0];
    saveSession({
      ...session,
      status: "finished",
      winnerCodename: winner?.codename ?? null,
      correctPrice: null,
    });
    return;
  }
  const product = await fetchRandomProduct();
  saveSession({
    ...session,
    currentRound: session.currentRound + 1,
    currentProduct: product,
    correctPrice: null,
    players: session.players.map((player) => ({ ...player, guess: null })),
  });
}

export function resetGame(): Session {
  const session = getStoredSession();
  const reset: Session = {
    ...session,
    status: "waiting",
    currentRound: 0,
    currentProduct: null,
    correctPrice: null,
    winnerCodename: null,
    players: session.players.map((player) => ({ ...player, score: 0, guess: null })),
  };
  saveSession(reset);
  return reset;
}

export function resetPlayers(): void {
  clearPlayers();
}
