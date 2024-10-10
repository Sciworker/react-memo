import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./SelectLevelPage.module.css";
import { Button } from "../../components/Button/Button";

export function SelectLevelPage() {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [easyMode, setEasyMode] = useState(false);
  const navigate = useNavigate();

  const handleLevelClick = (level) => {
    setSelectedLevel(level);
  };

  const handleEasyModeChange = (event) => {
    setEasyMode(event.target.checked);
  };

  const handlePlayClick = () => {
    if (selectedLevel) {
      const lives = easyMode ? 3 : 1;
      navigate(`/game/${selectedLevel}?lives=${lives}`);
    } else {
      alert("Пожалуйста, выберите уровень сложности");
    }
  };


  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Выбери <br /> сложность</h1>
        <ul className={styles.levels}>
          <li className={selectedLevel === 3 ? `${styles.level} ${styles.levelSelected}` : styles.level} onClick={() => handleLevelClick(3)}>
            <div className={selectedLevel === 3 ? styles.levelLinkSelected : styles.levelLink}>
              1
            </div>
          </li>
          <li className={selectedLevel === 6 ? `${styles.level} ${styles.levelSelected}` : styles.level} onClick={() => handleLevelClick(6)}>
            <div className={selectedLevel === 6 ? styles.levelLinkSelected : styles.levelLink}>
              2
            </div>
          </li>
          <li className={selectedLevel === 9 ? `${styles.level} ${styles.levelSelected}` : styles.level} onClick={() => handleLevelClick(9)}>
            <div className={selectedLevel === 9 ? styles.levelLinkSelected : styles.levelLink}>
              3
            </div>
          </li>
        </ul>
        <div className={styles.checkbox_input}>
          <input
            className={styles.checkbox}
            type="checkbox"
            checked={easyMode}
            onChange={handleEasyModeChange}
          />
          <label className={styles.label}>Лёгкий режим (3 жизни)</label>
        </div>
        <Button onClick={handlePlayClick}>Играть</Button>
        <Link className={styles.leaderboard_link} to="/leaderboard">Перейти к лидерборду</Link>
      </div>
    </div>
  );
}
