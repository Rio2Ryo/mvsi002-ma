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
  lang: "en",           // ← 既定を en に
  setLang: () => {},
});

const LS_KEY = "siteLang";
const SUPPORTED = ["ja", "en", "ms", "zh"];

function safeGet(obj, path) {
  return path.split(".").reduce((o, k) => (o && o[k] != null ? o[k] : null), obj);
}

// 言語推定（URL先頭 > localStorage > <html lang> > navigator.language）
function detectInitialLang() {
  // 1) /en/ /ms/ /zh/ を優先
  try {
    if (typeof window !== "undefined") {
      const segs = window.location.pathname.split("/").filter(Boolean);
      const maybe = (segs[0] || "").toLowerCase();
      if (SUPPORTED.includes(maybe)) return maybe;
    }
  } catch {}

  // 2) localStorage
  try {
    const saved = typeof window !== "undefined" ? localStorage.getItem(LS_KEY) : null;
    if (SUPPORTED.includes(saved)) return saved;
  } catch {}

  // 3) <html lang>
  if (typeof document !== "undefined") {
    const htmlLang = (document.documentElement.lang || "").toLowerCase();
    if (SUPPORTED.includes(htmlLang)) return htmlLang;
  }

  // 4) navigator.language
  if (typeof navigator !== "undefined") {
    const nav = (navigator.language || "").toLowerCase();
    if (nav.startsWith("en")) return "en";
    if (nav.startsWith("ms")) return "ms";
    if (nav.startsWith("zh")) return "zh"; // zh-CN/zh-TW などは zh に集約
    if (nav.startsWith("ja")) return "ja";
  }

  // 5) 最終フォールバックは英語
  return "en";
}

export function I18nProvider({ children }) {
  // ① 初回SSRは "en" に固定（水和ズレ防止 & 既定言語を英語に）
  const [lang, setLangState] = useState("en");
  const [messages, setMessages] = useState({});

  // ② クライアントで希望言語に切替
  useEffect(() => {
    if (typeof window === "undefined") return;
    const initial = detectInitialLang();
    setLangState(initial);
    document.documentElement.lang = initial || "en";
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
          document.documentElement.lang = lang || "en";
        }
      } catch (e) {
        // 辞書が見つからなければ en にフォールバック
        const mod = await import(`../locales/en.json`);
        const dict = mod.default || mod;
        if (!cancelled) {
          setMessages(dict || {});
          setLangState("en");
          document.documentElement.lang = "en";
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
    setLangState(SUPPORTED.includes(n) ? n : "en");  // ← 無効値は en へ
  };

  const value = useMemo(() => ({ t, lang, setLang }), [t, lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
