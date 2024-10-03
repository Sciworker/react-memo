import { shuffle } from "lodash";
import { useEffect, useState } from "react";
import { generateDeck } from "../../utils/cards";
import styles from "./Cards.module.css";
import { EndGameModal } from "../../components/EndGameModal/EndGameModal";
import { Button } from "../../components/Button/Button";
import { Card } from "../../components/Card/Card";

const STATUS_LOST = "STATUS_LOST";
const STATUS_WON = "STATUS_WON";
const STATUS_IN_PROGRESS = "STATUS_IN_PROGRESS";
const STATUS_PREVIEW = "STATUS_PREVIEW";

function getTimerValue(startDate, endDate) {
  if (!startDate && !endDate) {
    return {
      minutes: 0,
      seconds: 0,
    };
  }

  if (endDate === null) {
    endDate = new Date();
  }

  const diffInSeconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
  const minutes = Math.floor(diffInSeconds / 60);
  const seconds = diffInSeconds % 60;
  return {
    minutes,
    seconds,
  };
}

export function Cards({ pairsCount = 3, previewSeconds = 5, lives = 3 }) {
  const [cards, setCards] = useState([]);
  const [status, setStatus] = useState(STATUS_PREVIEW);
  const [livesCount, setLivesCount] = useState(lives);
  const [gameStartDate, setGameStartDate] = useState(null);
  const [gameEndDate, setGameEndDate] = useState(null);
  const [timer, setTimer] = useState({ seconds: 0, minutes: 0 });
  const [openCards, setOpenCards] = useState([]);

  function finishGame(status = STATUS_LOST) {
    setGameEndDate(new Date());
    setStatus(status);
  }

  function startGame() {
    const startDate = new Date();
    setGameEndDate(null);
    setGameStartDate(startDate);
    setTimer(getTimerValue(startDate, null));
    setStatus(STATUS_IN_PROGRESS);
    setOpenCards([]);
  }

  function resetGame() {
    setCards([]);
    setLivesCount(lives);
    setGameStartDate(null);
    setGameEndDate(null);
    setTimer(getTimerValue(null, null));
    setStatus(STATUS_PREVIEW);
    setOpenCards([]);
  }

  const openCard = (clickedCard) => {
    if (clickedCard.open || status !== STATUS_IN_PROGRESS) {
      return;
    }

    const nextCards = cards.map((card) => {
      if (card.id !== clickedCard.id) {
        return card;
      }
      return {
        ...card,
        open: true,
      };
    });

    setOpenCards((prev) => [...prev, clickedCard]);
    setCards(nextCards);

    const isPlayerWon = nextCards.every((card) => card.open);

    if (isPlayerWon) {
      finishGame(STATUS_WON);
      return;
    }

    if (openCards.length === 1) {
      const firstOpenCard = openCards[0];

      if (
        firstOpenCard.suit !== clickedCard.suit ||
        firstOpenCard.rank !== clickedCard.rank
      ) {
        const remainingLives = livesCount - 1;
        setLivesCount(remainingLives);

        if (remainingLives <= 0) {
          finishGame(STATUS_LOST);
        } else {
          setTimeout(() => {
            setCards((prevCards) =>
              prevCards.map((card) => {
                if (card.id === firstOpenCard.id || card.id === clickedCard.id) {
                  return { ...card, open: false };
                }
                return card;
              })
            );
            setOpenCards([]);
          }, 1000);
        }
      } else {
        setOpenCards([]);
      }
    }
  };

  const isGameEnded = status === STATUS_LOST || status === STATUS_WON;

  useEffect(() => {
    if (status !== STATUS_PREVIEW) {
      return;
    }

    if (pairsCount > 36) {
      alert("Столько пар сделать невозможно");
      return;
    }

    setCards(() => {
      return shuffle(generateDeck(pairsCount, 10));
    });

    const timerId = setTimeout(() => {
      startGame();
    }, previewSeconds * 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [status, pairsCount, previewSeconds]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer(getTimerValue(gameStartDate, gameEndDate));
    }, 300);

    return () => {
      clearInterval(intervalId);
    };
  }, [gameStartDate, gameEndDate]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.timer}>
          {status === STATUS_PREVIEW ? (
            <div>
              <p className={styles.previewText}>Запоминайте пары!</p>
              <p className={styles.previewDescription}>Игра начнется через {previewSeconds} секунд</p>
            </div>
          ) : (
            <>
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>min</div>
                <div>{timer.minutes.toString ().padStart (2, "0")}</div>
              </div>
              .
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>sec</div>
                <div>{timer.seconds.toString ().padStart (2, "0")}</div>
              </div>
            </>
          )}
        </div>
        {status === STATUS_IN_PROGRESS ? <Button onClick={resetGame}>Начать заново</Button> : null}
      </div>

      <div className={styles.cards}>
        {cards.map ((card) => (
          <Card
            key={card.id}
            onClick={() => openCard (card)}
            open={status !== STATUS_IN_PROGRESS ? true : card.open}
            suit={card.suit}
            rank={card.rank}
          />
        ))}
      </div>

      {isGameEnded ? (
        <div className={styles.modalContainer}>
          <EndGameModal
            isWon={status === STATUS_WON}
            gameDurationSeconds={timer.seconds}
            gameDurationMinutes={timer.minutes}
            onClick={resetGame}
          />
        </div>
      ) : null}

      <div className={styles.lives}>
        <p>Осталось жизней: {livesCount}</p>
      </div>

    </div>
  );
}
