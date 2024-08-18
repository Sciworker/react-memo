import { Link } from "react-router-dom";
import styles from "./SelectLevelPage.module.css";
import { useAtom } from "jotai";
import { easyModeAtom } from "../../store/easy-mode.atom";
import Checkbox from "../../components/Checkbox/checkbox";

export function SelectLevelPage() {
  const [easyMode, setEasyMod] = useAtom(easyModeAtom);

  const onCheckboxChange = () => {
    setEasyMod(!easyMode);
  };

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Выбери сложность</h1>
        <ul className={styles.levels}>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/3">
              1
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/6">
              2
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/9">
              3
            </Link>
          </li>
        </ul>
        <Checkbox label={"Упрощенный режим"} name={"checkbox"} checked={easyMode} onChange={onCheckboxChange} />
      </div>
    </div>
  );
}
