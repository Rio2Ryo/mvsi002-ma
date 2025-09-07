"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const I18nContext = createContext({
  t: (k) => k,
  lang: "ja",
  setLang: () => {},
});

const LS_KEY = "siteLang";
const SUPPORTED = ["ja", "en", "ms", "zh"];

function safeGet(obj, path) {
  return path.split(".").reduce((o, k) => (o && o[k] != null ? o[k] : null), obj);
}

// 言語推定（localStorage > <html lang> > navigator.language）
function detectInitialLang() {
  try {
    const saved = typeof window !== "undefined" ? localStorage.getItem(LS_KEY) : null;
    if (SUPPORTED.includes(saved)) return saved;
  } catch {}
  if (typeof document !== "undefined") {
    const htmlLang = (document.documentElement.lang || "").toLowerCase();
    if (SUPPORTED.includes(htmlLang)) return htmlLang;
  }
  if (typeof navigator !== "undefined") {
    const nav = (navigator.language || "").toLowerCase();
    if (nav.startsWith("en")) return "en";
    if (nav.startsWith("ms")) return "ms";
    if (nav.startsWith("zh")) return "zh"; // zh-CN/zh-TWなどはひとまずzhに集約
  }
  return "ja";
}

export function I18nProvider({ children }) {
  // ① 初回SSRは必ず "ja" に固定（水和ズレ防止）
  const [lang, setLangState] = useState("ja");
  const [messages, setMessages] = useState({});

  // ② クライアントで希望言語に切替
  useEffect(() => {
    if (typeof window === "undefined") return;
    const initial = detectInitialLang();
    setLangState(initial);
    document.documentElement.lang = initial;
  }, []);

  // ③ 言語切替ごとに辞書を動的ロード（/src/locales/{lang}.json）
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mod = await import(`../locales/${lang}.json`);
        const dict = mod.default || mod;
        if (!cancelled) {
          setMessages(dict || {});
          try { localStorage.setItem(LS_KEY, lang); } catch {}
          document.documentElement.lang = lang;
        }
      } catch (e) {
        // 辞書が見つからなければ ja にフォールバック
        const mod = await import(`../locales/ja.json`);
        const dict = mod.default || mod;
        if (!cancelled) {
          setMessages(dict || {});
          setLangState("ja");
          document.documentElement.lang = "ja";
        }
      }
    })();
    return () => { cancelled = true; };
  }, [lang]);

  // ④ 外部からの切替イベント（任意）
  useEffect(() => {
    const onEvt = (e) => {
      if (e instanceof CustomEvent && e.detail?.lang) {
        const next = String(e.detail.lang).toLowerCase();
        if (SUPPORTED.includes(next)) setLangState(next);
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("app:langChange", onEvt);
      return () => window.removeEventListener("app:langChange", onEvt);
    }
  }, []);

  const t = useMemo(() => {
    return (key) => {
      const v = safeGet(messages, key);
      return typeof v === "string" ? v : key; // 未翻訳はキーを返す
    };
  }, [messages]);

  const setLang = (next) => {
    const n = String(next).toLowerCase();
    setLangState(SUPPORTED.includes(n) ? n : "ja");
  };

  const value = useMemo(() => ({ t, lang, setLang }), [t, lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
