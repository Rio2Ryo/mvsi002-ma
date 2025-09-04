// pages/api/checkout-redirect.js

export default async function handler(req, res) {
    try {
      // ★ 直接埋め込み（本来は .env.local に置くべき）
      const apiKey =
        "IST.eyJraWQiOiJQb3pIX2FDMiIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjoie1wiaWRcIjpcIjA4MGY4OTJhLTJlNTItNGVkOS04YzhiLTEyNWU5OGRjNzI4MlwiLFwiaWRlbnRpdHlcIjp7XCJ0eXBlXCI6XCJhcHBsaWNhdGlvblwiLFwiaWRcIjpcIjg5MzAwM2MxLWY4ZGYtNDRkNy1hNGFjLTliNzE1YzM3OGE1M1wifSxcInRlbmFudFwiOntcInR5cGVcIjpcImFjY291bnRcIixcImlkXCI6XCJhMjBlYjc2Zi1iNzRlLTRkZWEtYTEwMy1hZTZiNzk3YTQ4MDZcIn19IiwiaWF0IjoxNzU2OTY2MDIzfQ.PlnOAQvacjTT7B39Q-Yiy63vnLlIgn9wCQGBjN39FA4fsil_vQ14QXbxFdUfhleeCiTFqX76JrEzL9HIxztyYoIaH8HRwvyfTSbIq-t_a_0Sb4pFe_u3OWG5j_uqMjNHmvwnTeDXRvyQvwLbr6P0c87FcJ8g31rgstXCJMzbVLUvPq02Zpf0Kb8raIW5oUzzfgG0tZV3Mn_s1DJAv-Oy9mRYbaY5k4xWxYDtdsPsg30f52YORqYtJgFQyLMyDxCi2ulDrbx0xWmXwISRPA3nCs79gfvBoJb4VFVZJmHEQ4XLjHAfQya5LyeZUbqBbozP5MTjzS9sEEC7B84NWQGqdQ";
  
      const siteId = "98bfd576-1798-4f0d-bd5d-5c50893ddb63";
  
      const { checkoutId } = req.query;
      if (!checkoutId) {
        return res.status(400).json({ error: "missing checkoutId" });
      }
  
      const r = await fetch("https://www.wixapis.com/redirects/v1/redirect-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": apiKey,
          "wix-site-id": siteId, // ★これが必須！
        },
        body: JSON.stringify({
          ecomCheckout: { checkoutId },
          callbacks: {
            postFlowUrl: "https://www.dotpb.jp/thank-you-page", // ★サンクスページ
          },
        }),
      });
  
      if (!r.ok) {
        const text = await r.text();
        return res.status(r.status).json({ error: text });
      }
  
      const data = await r.json();
      const url = data?.redirectSession?.fullUrl || data?.redirectSession?.url;
  
      if (!url) {
        return res.status(500).json({ error: "redirect URL not found in response" });
      }
  
      return res.status(200).json({ url });
    } catch (e) {
      return res.status(500).json({ error: e?.message || "unknown error" });
    }
  }
  