"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { t, type Lang, type Translations } from "./i18n";

type LangCtx = { lang: Lang; tr: Translations; setLang: (l: Lang) => void; isRTL: boolean };

const LangContext = createContext<LangCtx>({
  lang: "en", tr: t.en, setLang: () => {}, isRTL: false,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  const setLang = (l: Lang) => {
    setLangState(l);
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = l;
  };

  return (
    <LangContext.Provider value={{ lang, tr: t[lang], setLang, isRTL: lang === "ar" }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
