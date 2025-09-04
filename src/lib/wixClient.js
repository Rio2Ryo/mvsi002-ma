import Cookies from "js-cookie";
import { createClient, OAuthStrategy } from "@wix/sdk";
import { products } from "@wix/stores";
import { currentCart } from "@wix/ecom";
import { redirects } from "@wix/redirects";
import { CLIENT_ID } from "@/constants/constants";

export const myWixClient = createClient({
  modules: { products, currentCart, redirects },
  siteId: process.env.NEXT_PUBLIC_WIX_SITE_ID, // ← このサイトのものに必ず一致
  auth: OAuthStrategy({ clientId: CLIENT_ID }), // ← まずは素で初期化
});

/** ブラウザ側で必ず呼ぶ：訪問者トークンを確保してクライアントにセット */
export async function ensureVisitorSession() {
  if (typeof window === "undefined") return; // SSRガード

  // 既存Cookieがあればそれを使う（壊れていたら捨てて再発行）
  const raw = Cookies.get("session");
  if (raw) {
    try {
      myWixClient.auth.setTokens(JSON.parse(raw));
      return;
    } catch {
      // fallthrough to re-generate
    }
  }

  const tokens = await myWixClient.auth.generateVisitorTokens();
  myWixClient.auth.setTokens(tokens);
  Cookies.set("session", JSON.stringify(tokens), {
    sameSite: "lax",
    secure: true,
    path: "/",
    // 有効期限は任意（例：1日）
    expires: 1,
  });
}
