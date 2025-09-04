// pages/thank-you-page.tsx
import Head from "next/head";

export default function ThankYouPage() {
  return (
    <>
      <Head>
        <title>ご購入ありがとうございました</title>
      </Head>
      <main style={{ maxWidth: 720, margin: "80px auto", padding: "0 16px", textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1.5rem" }}>
          ご購入ありがとうございました
        </h1>
        <p>ご注文が正常に完了しました。</p>
      </main>
    </>
  );
}
