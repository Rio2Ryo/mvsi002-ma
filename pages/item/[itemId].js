import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";

import HeroSection from "../../src/components/HeroSection";
import ConceptSection from "../../src/components/ConceptSection";
import FeatureSection from "../../src/components/FeatureSection";
import TestimonialSection from "../../src/components/TestimonialSection";
import ProductSection_2 from "../../src/components/ProductSection_2";
import Effects from "../../src/components/Effects";
import GuaranteeSection from "../../src/components/GuaranteeSection";
import FAQSection from "../../src/components/FAQSection";
import Footer from "../../src/components/Footer";

export default function AgentItemPage() {
  const { isReady, query } = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isReady || !query.itemId) return;

    async function fetchProducts() {
      const agentId = String(query.itemId).toLowerCase(); // ← 厳密に文字列化

      try {
        // ルート相対（/xxx.json）。自作サイトは言語プレフィックスを付けない
        const res = await fetch(`/${agentId}_products.json`, { cache: "no-store" });
        if (!res.ok) throw new Error("データ取得失敗");

        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("商品データの取得に失敗しました:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [isReady, query.itemId]);

  return (
    <div>
      <Head>
        <title>Mother Vegetables Confidence MV-Si002 | 24時間崩れない陶器肌へ</title>
      </Head>

      <HeroSection />
      <ConceptSection />
      <FeatureSection />
      <Effects />
      <TestimonialSection />
      {/* ProductSection_2 が内部で取得しているならそのまま。
          ここで取得した products を使う場合は props を渡す実装に合わせてください。 */}
      <ProductSection_2 />
      <GuaranteeSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
