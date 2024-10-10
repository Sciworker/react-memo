import React, { useState, useEffect } from "react";
import styles from "./EndGameModal.module.css";
import { Button } from "../Button/Button";
import deadImageUrl from "./images/dead.png";
import celebrationImageUrl from "./images/celebration.png";
import { getLeader, addLeader } from "../../api/api";
import { Link, useNavigate } from "react-router-dom";

export function EndGameModal({ isWon, gameDurationSeconds, gameDurationMinutes, onClick, achievements }) {
  const [isTopTen, setIsTopTen] = useState(false);
  const [title, setTitle] = useState(isWon ? "Вы победили!" : "Вы проиграли!");
  const [username, setUsername] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const imgSrc = isWon ? celebrationImageUrl : deadImageUrl;
  const imgAlt = isWon ? "celebration emoji" : "dead emoji";
  const totalTime = gameDurationMinutes * 60 + gameDurationSeconds;

  const checkTopTen = async () => {
    const data = await getLeader();
    if (data && data.leaders) {
      const topTen = data.leaders
        .sort((a, b) => a.time - b.time)
        .slice(0, 10);
      if (topTen.length < 10 || totalTime < topTen[topTen.length - 1].time) {
        setIsTopTen(true);
        setTitle("Вы попали на Лидерборд!");
      } else {
        setTitle("Вы победили!");
      }
    }
  };

  useEffect(() => {
    if (isWon) {
      checkTopTen();
    }
  }, [isWon, totalTime]);

  const saveLeaderData = async () => {
    const leaderName = username.trim() === "" ? "Пользователь" : username;
  
    if (!isSubmitted) {
      await addLeader(leaderName, totalTime, achievements);
      setIsSubmitted(true);
    }
  };

  const handlePlayAgain = async () => {
    await saveLeaderData();
    onClick();
  };

  const handleLeaderboardClick = async () => {
    await saveLeaderData();
    navigate("/leaderboard");
  };

  useEffect(() => {
    const handleModalClose = async (event) => {
      if (event.key === "Escape" && !isSubmitted) {
        await saveLeaderData();
      }
    };

    window.addEventListener("keydown", handleModalClose);
    return () => {
      window.removeEventListener("keydown", handleModalClose);
    };
  }, [isSubmitted]);

  return (
    <div className={styles.modal}>
      <img className={styles.image} src={imgSrc} alt={imgAlt} />
      <h2 className={styles.title}>{title}</h2>
      {isTopTen && !isSubmitted && (
        <>
          <input
            className={styles.input}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ваше имя"
          />
        </>
      )}
      <p className={styles.description}>Затраченное время:</p>
      <div className={styles.time}>
        {gameDurationMinutes.toString().padStart(2, "0")}.{gameDurationSeconds.toString().padStart(2, "0")}
      </div>
      <Button onClick={handlePlayAgain}>Играть снова</Button>
      <Link
        className={styles.leaderboard_link}
        to="/leaderboard"
        onClick={handleLeaderboardClick}
      >
        Перейти к лидерборду
      </Link>
    </div>
  );
}
