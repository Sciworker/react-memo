import styles from "./Button.module.css";
import classNames from "classnames";

export function Button({ children, onClick, className }) {
  return (
    <button onClick={onClick} className={classNames(styles.button, className)}>
      {children}
    </button>
  );
}
