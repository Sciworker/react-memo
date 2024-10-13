import React from "react";
import styles from "./popup.module.css";

export function Popup({ title, text, isVisible }) {
  if (!isVisible) return null;

  return (
    <div className={styles.popup}>
      <h4 className={styles.popupTitle}>{title}</h4>
      <p className={styles.popupText}>{text}</p>
    </div>
  );
}
