import { shuffle } from "lodash";
import { useEffect, useState } from "react";
import { generateDeck } from "../../utils/cards";
import styles from "./Cards.module.css";
import { EndGameModal } from "../../components/EndGameModal/EndGameModal";
import { Button } from "../../components/Button/Button";
import { Card } from "../../components/Card/Card";
import { useAtomValue } from "jotai";
import { easyModeAtom } from "../../store/easy-mode.atom";
import clsx from "clsx";

// Игра закончилась
const STATUS_LOST = "STATUS_LOST";
const STATUS_WON = "STATUS_WON";
// Идет игра: карты закрыты, игрок может их открыть
const STATUS_IN_PROGRESS = "STATUS_IN_PROGRESS";
// Начало игры: игрок видит все карты в течении нескольких секунд
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

  const diffInSecconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
  const minutes = Math.floor(diffInSecconds / 60);
  const seconds = diffInSecconds % 60;
  return {
    minutes,
    seconds,
  };
}

/**
 * Основной компонент игры, внутри него находится вся игровая механика и логика.
 * pairsCount - сколько пар будет в игре
 * previewSeconds - сколько секунд пользователь будет видеть все карты открытыми до начала игры
 */
export function Cards({ pairsCount = 3, previewSeconds = 5 }) {
  // В cards лежит игровое поле - массив карт и их состояние открыта\закрыта
  const [cards, setCards] = useState([]);
  // Текущий статус игры
  const [status, setStatus] = useState(STATUS_PREVIEW);

  // Дата начала игры
  const [gameStartDate, setGameStartDate] = useState(null);
  // Дата конца игры
  const [gameEndDate, setGameEndDate] = useState(null);

  // Стейт для таймера, высчитывается в setInteval на основе gameStartDate и gameEndDate
  const [timer, setTimer] = useState({
    seconds: 0,
    minutes: 0,
  });

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
  }
  function resetGame() {
    setGameStartDate(null);
    setGameEndDate(null);
    setTimer(getTimerValue(null, null));
    setLifeCount(3); // Reset lives when the game is reset
    setStatus(STATUS_PREVIEW);
  }

  /**
   * Обработка основного действия в игре - открытие карты.
   * После открытия карты игра может пепереходит в следующие состояния
   * - "Игрок выиграл", если на поле открыты все карты
   * - "Игрок проиграл", если на поле есть две открытые карты без пары
   * - "Игра продолжается", если не случилось первых двух условий
   */
  const openCard = clickedCard => {
    // Если карта уже открыта, то ничего не делаем
    if (clickedCard.open) {
      return;
    }

    // Открываем карту
    const nextCards = cards.map(card => {
      if (card.id !== clickedCard.id) {
        return card;
      }

      return {
        ...card,
        open: true,
      };
    });

    // Обновляем состояние карт
    setCards(nextCards);

    // Получаем все открытые карты
    const openCards = nextCards.filter(card => card.open);

    // Если включен режим сложности, то игрок может ошибаться 3 раза
    if (easyMode) {
      const openCardsWithoutPair = openCards.filter(card => {
        const sameCards = openCards.filter(openCard => card.suit === openCard.suit && card.rank === openCard.rank);
        return sameCards.length < 2;
      });

      if (openCardsWithoutPair.length === 2) {
        setTimeout(() => {
          setCards(
            cards.map(card => (card.open && openCardsWithoutPair.includes(card) ? { ...card, open: false } : card)),
          );
          setLifeCount(prev => prev - 1);
          if (lifeCount - 1 <= 0) {
            finishGame(STATUS_LOST);
          }
        }, 1);
        return;
      }
    }

    // Проверяем, все ли карты открыты
    const isPlayerWon = nextCards.every(card => card.open);

    // Если игрок выиграл, то заканчиваем игру
    if (isPlayerWon) {
      finishGame(STATUS_WON);
      return;
    }

    // Проверяем, есть ли на поле открытые карты без пары
    const openCardsWithoutPair = openCards.filter(card => {
      const sameCards = openCards.filter(openCard => card.suit === openCard.suit && card.rank === openCard.rank);
      return sameCards.length < 2;
    });

    const playerLost = openCardsWithoutPair.length >= 2;

    // Если игрок проиграл, то закрываем все карты
    if (!easyMode && playerLost) {
      finishGame(STATUS_LOST);
      return;
    }
  };

  const isGameEnded = status === STATUS_LOST || status === STATUS_WON;

  // Игровой цикл
  useEffect(() => {
    // В статусах кроме превью доп логики не требуется
    if (status !== STATUS_PREVIEW) {
      return;
    }

    // В статусе превью мы
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

  // Обновляем значение таймера в интервале
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer(getTimerValue(gameStartDate, gameEndDate));
    }, 300);
    return () => {
      clearInterval(intervalId);
    };
  }, [gameStartDate, gameEndDate]);

  // Счетчик жизней
  const easyMode = useAtomValue(easyModeAtom);
  const [lifeCount, setLifeCount] = useState(3);

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
                <div>{timer.minutes.toString().padStart("2", "0")}</div>
              </div>
              .
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>sec</div>
                <div>{timer.seconds.toString().padStart("2", "0")}</div>
              </div>
            </>
          )}
        </div>
        {status === STATUS_IN_PROGRESS && easyMode ? (
          <div className={"flex flex-col space-y-1.5 items-center"}>
            <div>
              <p className={"text-base text-white"}>
                Осталось {lifeCount} {lifeCount === 1 ? "попытка" : "попытки"}
              </p>
            </div>
            <div className={"flex flex-row items-center space-x-3"}>
              <svg
                className={clsx("fill-green transition-colors duration-300 ease-in-out", {
                  "opacity-70": lifeCount === 0,
                })}
                width="40"
                height="36"
                viewBox="0 0 40 36"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  id="Union"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20.0244 4.51805C17.4973 1.68832 14.1032 2.59568e-06 11.1392 2.59462e-06C6.07592 2.5928e-06 0.253163 2.85111 -1.23523e-07 11.4044C0.23552 19.8439 9.4544 26.9374 18.2802 33.7285C18.9413 34.2372 19.6003 34.7442 20.2531 35.25C20.2531 35.25 20.2531 35.25 20.2532 35.2499C20.2532 35.25 20.2532 35.25 20.2533 35.25C20.5763 34.9997 20.9002 34.7492 21.2246 34.4982C30.307 27.4724 39.7556 20.1633 40 11.4044C39.7468 2.8511 33.4178 0 28.3545 0C25.3905 0 22.2831 1.68832 20.0244 4.51805Z"
                />
              </svg>
              <svg
                className={clsx("fill-green", {
                  "opacity-70": lifeCount < 2,
                })}
                width="40"
                height="36"
                viewBox="0 0 40 36"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  id="Union"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20.0244 4.51805C17.4973 1.68832 14.1032 2.59568e-06 11.1392 2.59462e-06C6.07592 2.5928e-06 0.253163 2.85111 -1.23523e-07 11.4044C0.23552 19.8439 9.4544 26.9374 18.2802 33.7285C18.9413 34.2372 19.6003 34.7442 20.2531 35.25C20.2531 35.25 20.2531 35.25 20.2532 35.2499C20.2532 35.25 20.2532 35.25 20.2533 35.25C20.5763 34.9997 20.9002 34.7492 21.2246 34.4982C30.307 27.4724 39.7556 20.1633 40 11.4044C39.7468 2.8511 33.4178 0 28.3545 0C25.3905 0 22.2831 1.68832 20.0244 4.51805Z"
                />
              </svg>
              <svg
                className={clsx("fill-green", {
                  "opacity-40": lifeCount < 3,
                })}
                width="40"
                height="36"
                viewBox="0 0 40 36"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  id="Union"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20.0244 4.51805C17.4973 1.68832 14.1032 2.59568e-06 11.1392 2.59462e-06C6.07592 2.5928e-06 0.253163 2.85111 -1.23523e-07 11.4044C0.23552 19.8439 9.4544 26.9374 18.2802 33.7285C18.9413 34.2372 19.6003 34.7442 20.2531 35.25C20.2531 35.25 20.2531 35.25 20.2532 35.2499C20.2532 35.25 20.2532 35.25 20.2533 35.25C20.5763 34.9997 20.9002 34.7492 21.2246 34.4982C30.307 27.4724 39.7556 20.1633 40 11.4044C39.7468 2.8511 33.4178 0 28.3545 0C25.3905 0 22.2831 1.68832 20.0244 4.51805Z"
                />
              </svg>
            </div>
          </div>
        ) : null}
        {status === STATUS_IN_PROGRESS ? <Button onClick={resetGame}>Начать заново</Button> : null}
      </div>

      <div className={styles.cards}>
        {cards.map(card => (
          <Card
            key={card.id}
            onClick={() => openCard(card)}
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
    </div>
  );
}
