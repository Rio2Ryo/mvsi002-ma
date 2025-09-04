// src/lib/wixClient.js
import Cookies from "js-cookie";
import { createClient, OAuthStrategy } from "@wix/sdk";
import { products } from "@wix/stores";
import { currentCart } from "@wix/ecom";
import { redirects } from "@wix/redirects";
import { CLIENT_ID } from "@/constants/constants";

// siteId はズレると metaSite エラーの原因になるので、まずは外す（必要なら後で戻す）
// const SITE_ID = process.env.NEXT_PUBLIC_WIX_SITE_ID;

export const myWixClient = createClient({
  modules: { products, currentCart, redirects },
  // siteId: SITE_ID,
  auth: OAuthStrategy({ clientId: CLIENT_ID }),
});

/** ブラウザ側で必ず呼ぶ：訪問者トークンを確保してセット */
export async function ensureVisitorSession() {
  if (typeof window === "undefined") return;
  let raw = null;
  try {
    raw = Cookies.get("session") || null;
  } catch (_) {}

  if (raw) {
    try {
      myWixClient.auth.setTokens(JSON.parse(raw));
      return;
    } catch (_) {
      // 壊れたトークンは捨てる
    }
  }

  const tokens = await myWixClient.auth.generateVisitorTokens();
  myWixClient.auth.setTokens(tokens);
  try {
    Cookies.set("session", JSON.stringify(tokens), {
      sameSite: "lax",
      secure: true,
      path: "/",
      expires: 1, // 1日
    });
  } catch (_) {}
}

/** 401/Unauthenticated の時に一度だけトークン再発行して再試行 */
export async function withSession(fn) {
  await ensureVisitorSession();
  try {
    return await fn();
  } catch (e) {
    const msg = String(e && (e.message || e.toString() || ""));
    const status = e && (e.status || (e.response && e.response.status) || e.details && e.details.httpStatus);
    if (status === 401 || msg.includes("Unauthenticated")) {
      try { Cookies.remove("session"); } catch (_) {}
      await ensureVisitorSession();
      return await fn();
    }
    throw e;
  }
}
