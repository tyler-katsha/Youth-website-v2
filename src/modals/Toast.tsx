import { useEffect } from "react";
import styles from "../modules/Toast.module.css";
import type { ToastProps } from "../utils/types";

export const Toast = ({ message, type, onClose, duration = 5000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <span className={styles.icon}>{type === "success" ? "✓" : "✕"}</span>
      <p>{message}</p>
      <button onClick={onClose} className={styles.closeBtn}>×</button>
    </div>
  );
};