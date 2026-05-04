"use client";
import { useLang } from "@/lib/LangContext";
import styles from "./LangToggle.module.css";

export default function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className={styles.toggle}>
      <button
        className={`${styles.btn} ${lang === "en" ? styles.active : ""}`}
        onClick={() => setLang("en")}
      >
        EN
      </button>
      <button
        className={`${styles.btn} ${lang === "ar" ? styles.active : ""}`}
        onClick={() => setLang("ar")}
      >
        عربي
      </button>
    </div>
  );
}
