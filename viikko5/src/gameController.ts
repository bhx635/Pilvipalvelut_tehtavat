import { type Product } from "./types/Product";
import { type Session } from "./types/Session";
import { updateSession } from "./gameSessionService";

export async function fetchRandomProduct(): Promise<Product> {
  const response = await fetch("https://dummyjson.com/products");
  if (!response.ok) throw new Error("Tuotteiden haku epäonnistui.");
  const data: unknown = await response.json();
  if (
    !data ||
    typeof data !== "object" ||
    !("products" in data) ||
    !Array.isArray(data.products) ||
    data.products.length === 0
  ) {
    throw new Error("Tuotteita ei löytynyt.");
  }
  const products = data.products as Product[];
  return products[Math.floor(Math.random() * products.length)];
}

export function pointsForGuess(guess: number, price: number): number {
  const relativeDifference = Math.abs(guess - price) / Math.max(price, 1);
  return Math.max(0, Math.round(100 * (1 - relativeDifference)));
}

export async function startGameIfPossible(): Promise<Session> {
  const product = await fetchRandomProduct();
  return updateSession((session) => {
    if (session.status !== "waiting") throw new Error("Peli ei ole odotustilassa.");
    if (session.players.length < 2) throw new Error("Peliin tarvitaan vähintään 2 pelaajaa.");
    return {
      ...session,
      status: "playing",
      currentRound: 1,
      currentProduct: product,
      correctPrice: null,
      winnerCodename: null,
      players: session.players.map((player) => ({ ...player, guess: null })),
    };
  });
}

export function submitGuess(uid: string, guess: number): Promise<Session> {
  if (!Number.isFinite(guess) || guess < 0) {
    return Promise.reject(new Error("Arvauksen pitää olla vähintään 0."));
  }

  return updateSession((session) => {
    if (session.status !== "playing" || session.correctPrice !== null) {
      throw new Error("Tällä hetkellä ei voi arvata.");
    }
    if (!session.players.some((player) => player.uid === uid)) {
      throw new Error("Et ole mukana tässä pelissä.");
    }

    const player = session.players.find((item) => item.uid === uid);
    if (!player || player.guess !== null) throw new Error("Olet jo arvannut tällä kierroksella.");

    const players = session.players.map((item) =>
      item.uid === uid ? { ...item, guess } : item
    );
    if (players.some((item) => item.guess === null)) return { ...session, players };

    const correctPrice = session.currentProduct?.price;
    if (correctPrice === undefined) throw new Error("Kierroksella ei ole tuotetta.");

    return {
      ...session,
      correctPrice,
      players: players.map((item) => ({
        ...item,
        score: item.score + pointsForGuess(item.guess!, correctPrice),
      })),
    };
  });
}

export async function nextRound(session: Session): Promise<Session> {
  const product = session.currentRound < session.maxRounds
    ? await fetchRandomProduct()
    : null;

  return updateSession((current) => {
    if (current.status !== "playing" || current.correctPrice === null) {
      throw new Error("Kaikki pelaajat eivät ole vielä arvannut.");
    }
    if (current.currentRound >= current.maxRounds) {
      const winner = [...current.players].sort((a, b) => b.score - a.score)[0];
      return {
        ...current,
        status: "finished",
        currentProduct: null,
        correctPrice: null,
        winnerCodename: winner?.codename ?? null,
      };
    }
    if (!product) throw new Error("Seuraavan kierroksen tuotetta ei saatu haettua.");
    return {
      ...current,
      currentRound: current.currentRound + 1,
      currentProduct: product,
      correctPrice: null,
      players: current.players.map((player) => ({ ...player, guess: null })),
    };
  });
}

export function resetGame(): Promise<Session> {
  return updateSession((session) => {
    if (session.status !== "finished") throw new Error("Vain päättyneen pelin voi aloittaa alusta.");
    return {
      ...session,
      status: "waiting",
      currentRound: 0,
      currentProduct: null,
      correctPrice: null,
      winnerCodename: null,
      players: session.players.map((player) => ({ ...player, score: 0, guess: null })),
    };
  });
}
