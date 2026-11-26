import { type Player } from "../types/Player";
import { pointsForGuess } from "../gameController";

type Props = {
  players: Player[];
  correctPrice: number;
  onNextRound: () => void;
};

export function RoundResult({ players, correctPrice, onNextRound }: Props) {
  const sorted = [...players].sort((a, b) =>
    Math.abs((a.guess ?? 0) - correctPrice) -
    Math.abs((b.guess ?? 0) - correctPrice)
  );

  return (
    <div className="result-card">
      <h2>Kierroksen tulos</h2>
      <p>Oikea hinta: <strong>{correctPrice} €</strong></p>
      <ul>
        {sorted.map((player) => (
          <li key={player.uid}>
            {player.codename}: {player.guess === null ? "ei arvausta" : player.guess.toFixed(2)} € — ero{" "}
            {player.guess === null ? "–" : Math.abs(player.guess - correctPrice).toFixed(2)} € —
            kierroksen pisteet {player.guess === null ? 0 : pointsForGuess(player.guess, correctPrice)} —
            yhteensä {player.score}
          </li>
        ))}
      </ul>
      <button onClick={onNextRound}>Seuraava kierros</button>
    </div>
  );
}
