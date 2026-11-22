import { type Player } from "../types/Player";

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
            {player.codename}: {player.guess ?? "ei arvausta"} € — ero{" "}
            {player.guess === null ? "–" : Math.abs(player.guess - correctPrice)} € — pisteet {player.score}
          </li>
        ))}
      </ul>
      <button onClick={onNextRound}>Seuraava kierros</button>
    </div>
  );
}
