import React, { useState, useEffect } from "react";
import classes from "./Leaderboard.module.css";
import { getLeader } from "../../api/api";
import { Button } from "../../components/Button/Button";
import styles from './../../components/Button/Button.module.css';
import NonHardImageUrl from './images/non-hard.svg';
import NonPowerImageUrl from './images/non-power.svg';
import PowerImageUrl from './images/power.svg';
import HardImageUrl from './images/hard.svg';
import { Tooltip } from 'react-tooltip';

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

  const renderAchievements = (achievements) => {
    const tooltipStyle = {
      backgroundColor: "#C2F5FF",
      color: "#004980",
      fontSize: "18px",
      lineHeight: "24px",
      width: "212px",
      padding: "10px",
      borderRadius: "12px",
      textAlign: "center",
    };

    if (achievements.length === 0) {
      return (
        <>
          <img src={NonHardImageUrl} alt="Non-Hard Achievement" />
          <img src={NonPowerImageUrl} alt="Non-Power Achievement" />
        </>
      );
    } else if (achievements.includes(1) && achievements.includes(2)) {
      return (
        <>
          <img
            src={HardImageUrl}
            alt="Hard Achievement"
            data-tooltip-id="hardTooltip"
          />
          <img
            src={PowerImageUrl}
            alt="Power Achievement"
            data-tooltip-id="powerTooltip"
          />
          <Tooltip
            id="hardTooltip"
            style={tooltipStyle}
            content="Игра пройдена в сложном режиме"
            place="top-start"
            effect="solid"
          />
          <Tooltip
            id="powerTooltip"
            style={tooltipStyle}
            content="Игра пройдена без супер-сил"
            place="top-start"
            effect="solid"
          />
        </>
      );
    } else if (achievements.includes(1)) {
      return (
        <>
          <img
            src={HardImageUrl}
            alt="Hard Achievement"
            data-tooltip-id="hardTooltip"
          />
          <img src={NonPowerImageUrl} alt="Non-Power Achievement" />
          <Tooltip
            id="hardTooltip"
            style={tooltipStyle}
            content="Игра пройдена в сложном режиме"
            place="top-start"
            effect="solid"
          />
        </>
      );
    } else if (achievements.includes(2)) {
      return (
        <>
          <img src={NonHardImageUrl} alt="Non-Hard Achievement" />
          <img
            src={PowerImageUrl}
            alt="Power Achievement"
            data-tooltip-id="powerTooltip"
          />
          <Tooltip
            id="powerTooltip"
            style={tooltipStyle}
            content="Игра пройдена без супер-сил"
            place="top-start"
            effect="solid"
          />
        </>
      );
    } else {
      return (
        <>
          <img src={NonHardImageUrl} alt="Non-Hard Achievement" />
          <img src={NonPowerImageUrl} alt="Non-Power Achievement" />
        </>
      );
    }
  };

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
          <h5 className={`${classes.table_title} ${classes.column_3}`}>Достижения</h5>
          <h5 className={`${classes.table_title} ${classes.column_4}`}>Время</h5>
        </div>
        {leaders.map((leader, index) => (
          <div className={classes.table_block} key={leader.id}>
            <span className={`${classes.leader_data} ${classes.column_1}`}>{index + 1}</span>
            <span className={`${classes.leader_data} ${classes.column_2}`}>{leader.name}</span>
            <div className={`${classes.leader_data} ${classes.column_3}`}>
              {renderAchievements(leader.achievements)}
            </div>
            <span className={`${classes.leader_data} ${classes.column_4}`}>{formatTime(leader.time)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
