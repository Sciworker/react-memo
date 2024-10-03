import React, { useState, useEffect } from "react";
import classes from "./Leaderboard.module.css";
import { getLeader } from "../../api/api";
import { Button } from "../../components/Button/Button";
import styles from './../../components/Button/Button.module.css'

export function Leaderboard() {
  const [leaders, setLeaders] = useState([]);


  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  useEffect(() => {
    async function fetchLeaders() {
      const data = await getLeader();
      if (data) {
        const sortedLeaders = data.leaders
          .sort((a, b) => a.time - b.time)
          .slice(0, 10);
        setLeaders(sortedLeaders);
      }
    }
    fetchLeaders();
  }, []);

  return (
    <div className="container">
      <div className={classes.leaderboard_header}>
        <h3 className={classes.leaderboard_title}>Лидерборд</h3>
        <Button className={styles.button_in_leaderboard}>Начать игру</Button>
      </div>
      <div className={classes.top_players_table}>
        <div className={classes.table_block}>
          <h5 className={`${classes.table_title} ${classes.column_1}`}>Позиция</h5>
          <h5 className={`${classes.table_title} ${classes.column_2}`}>Пользователь</h5>
          <h5 className={`${classes.table_title} ${classes.column_3}`}>Время</h5>
        </div>
        {leaders.map((leader, index) => (
          <div className={classes.table_block} key={leader.id}>
            <p className={`${classes.leader_data} ${classes.column_1}`}>{index + 1}</p>
            <p className={`${classes.leader_data} ${classes.column_2}`}>{leader.name}</p>
            <p className={`${classes.leader_data} ${classes.column_3}`}>{formatTime(leader.time)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
