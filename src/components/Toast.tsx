"use client";
import styles from "./Toast.module.css";

export default function Toast({ msg, type }: { msg: string; type?: "error" }) {
  return (
    <div className={`${styles.toast} ${type === "error" ? styles.error : styles.success}`}>
      {type === "error" ? "⚠ " : "✓ "}{msg}
    </div>
  );
}
