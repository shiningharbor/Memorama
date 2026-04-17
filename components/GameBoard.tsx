"use client";

import { useEffect, useState } from "react";

const pairs = ["A", "B", "C", "D", "E", "F", "G", "H"];

type CardType = {
  id: string;
  pair: string;
  img: string;
};

function generateCards(): CardType[] {
  // 🔥 cartas separadas
  const ones: CardType[] = [];
  const twos: CardType[] = [];

  pairs.forEach((letter) => {
    ones.push({
      id: `${letter}-1`,
      pair: letter,
      img: `/memo/cartas/${letter}-1.png`,
    });

    twos.push({
      id: `${letter}-2`,
      pair: letter,
      img: `/memo/cartas/${letter}-2.png`,
    });
  });

  // 🔀 shuffle independiente
  const shuffle = (arr: CardType[]) =>
    arr.sort(() => Math.random() - 0.5);

  const shuffledOnes = shuffle(ones);
  const shuffledTwos = shuffle(twos);

  const result: CardType[] = [];

  let i1 = 0;
  let i2 = 0;

  for (let i = 0; i < 16; i++) {
    const row = Math.floor(i / 4);
    const col = i % 4;

    const rowPattern = ["b", "a", "a", "b"];
    const start = rowPattern[row];
    const isEvenCol = col % 2 === 0;

    const isA =
      start === "a"
        ? isEvenCol
        : !isEvenCol;

    if (isA) {
      result.push(shuffledOnes[i1++]); // 🔥 solo -1
    } else {
      result.push(shuffledTwos[i2++]); // 🔥 solo -2
    }
  }

  return result;
}

export default function GameBoard({ onFinish }: { onFinish: () => void }) {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [lastMatch, setLastMatch] = useState<number[]>([]); // 🔥 animación

  useEffect(() => {
    setCards(generateCards());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev < 100 ? prev + 1 : 100));
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timeLeft === 100) onFinish();
  }, [timeLeft, onFinish]);

  const handleClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [a, b] = newFlipped;

      if (cards[a].pair === cards[b].pair) {
        setLastMatch([a, b]); // 🔥 para animación

        setMatched((prev) => {
          const newMatched = [...prev, a, b];

          if (newMatched.length === cards.length) {
            setTimeout(onFinish, 500);
          }

          return newMatched;
        });

        setTimeout(() => {
          setLastMatch([]);
        }, 500);

        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 700);
      }
    }
  };

  const getBackImage = (i: number) => {
    const row = Math.floor(i / 4);
    const col = i % 4;

    // 🔥 patrón por fila
    const rowPattern = [
      "b", // fila 1
      "a", // fila 2
      "a", // fila 3
      "b", // fila 4
    ];

    const start = rowPattern[row];

    // alternar dentro de la fila
    const isEvenCol = col % 2 === 0;

    if (start === "a") {
      return isEvenCol
        ? "/memo/bg-a.png"
        : "/memo/bg-b.png";
    } else {
      return isEvenCol
        ? "/memo/bg-b.png"
        : "/memo/bg-a.png";
    }
  };

  return (
    <div className="game-container">

      <div className="grid">
        {cards.map((card, i) => {
          const isFlipped = flipped.includes(i) || matched.includes(i);
          const isMatched = matched.includes(i);
          const isNewMatch = lastMatch.includes(i);

          return (
            <div
              key={card.id}
              className={`card ${isNewMatch ? "match-anim" : ""}`}
              onClick={() => handleClick(i)}
            >

              {/* DORSO */}
              {!isFlipped && (
                <img src={getBackImage(i)} className="card-img" />
              )}

              {/* FRENTE */}
              {isFlipped && (
                <div className="card-front">

                  {/* 🔥 COLOR DEL PAR */}
                  <img
                    src={`/memo/cartas/${card.pair}.png`}
                    className="card-bg"
                  />

                  {/* 🔥 IMAGEN PRINCIPAL */}
                  <img
                    src={card.img}
                    className="card-img"
                  />

                  {/* 🔥 PALOMITA */}
                  {isMatched && (
                    <img
                      src="/memo/cartas/correcto.png"
                      className="check"
                    />
                  )}
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* TIMER */}
      <div className="timer-row">

        <div className="timer">
          <div
            className="timer-bar"
            style={{ width: `${timeLeft}%` }}
          >
            <img src="/memo/carga-verde.png" />
          </div>

          <img src="/memo/carga.png" className="timer-frame" />
        </div>

        <img src="/logo.png" className="timer-logo" />

      </div>

    </div>
  );
}