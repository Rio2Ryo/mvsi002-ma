"use client";

import React from "react";
import { useI18n } from "../lib/i18n";

export default function FAQSection() {
  const { t } = useI18n();
  const tx = (k, fb) => {
    const v = t ? t(k) : undefined;
    return v && v !== k ? v : fb;
  };

  const faqs = [
    {
      q: tx("faq.items.0.q", "敏感肌でも使えますか？"),
      a: tx(
        "faq.items.0.a",
        "はい、医薬部外品原料規格をクリアした安全な処方です。敏感肌の方でも安心してお使いいただけます。"
      ),
    },
    {
      q: tx("faq.items.1.q", "いつ使えばいいですか？"),
      a: tx(
        "faq.items.1.a",
        "スキンケアの後、メイクの仕上げまで、どのタイミングでもお使いいただけます。下地の上からでも、ファンデーションの後でも、お好みのタイミングでご使用ください。"
      ),
    },
    {
      q: tx("faq.items.2.q", "どのくらい持ちますか？"),
      a: tx(
        "faq.items.2.a",
        "1日1回の使用で、500mgは約30日、2,000mgは約60日、5,000mgは約150日ご使用いただけます。"
      ),
    },
  ];

  return (
    <>
      <section style={styles.section}>
        <div style={styles.container}>
          <div style={styles.inner}>
            <div style={styles.header}>
              <p style={styles.label}>{tx("faq.label", "よくあるご質問")}</p>
              <h2 style={styles.title}>{tx("faq.title", "よくあるご質問")}</h2>
              <div style={styles.separator} />
            </div>

            <div style={styles.faqList}>
              {faqs.map((faq, index) => (
                <div key={index} style={styles.faqItem}>
                  <h3 className="faq-question" style={styles.question}>
                    Q. {faq.q}
                  </h3>
                  <p className="faq-answer" style={styles.answer}>
                    A. {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @media (min-width: 768px) {
          h2 {
            font-size: 2.25rem !important;
            margin-bottom: 2rem !important;
          }
          .faq-question {
            font-size: 1.125rem !important;
            margin-bottom: 0.75rem !important;
          }
          .faq-answer {
            font-size: 1rem !important;
          }
        }
      `}</style>
    </>
  );
}

const styles = {
  section: { padding: "5rem 1rem", background: "#ffffff" },
  container: { maxWidth: "1200px", margin: "0 auto" },
  inner: { maxWidth: "900px", margin: "0 auto" },
  header: { textAlign: "center", marginBottom: "4rem" },
  label: {
    fontSize: "0.875rem",
    color: "#b8860b",
    marginBottom: "1rem",
    letterSpacing: "0.1em",
  },
  title: { fontSize: "1.75rem", fontWeight: "bold", color: "#1f2937", marginBottom: "1.5rem" },
  separator: { width: "80px", height: "4px", backgroundColor: "#b8860b", margin: "0 auto" },
  faqList: { display: "flex", flexDirection: "column", gap: "2rem" },
  faqItem: { borderBottom: "1px solid #e5e7eb", paddingBottom: "1.5rem" },
  question: { fontSize: "1rem", fontWeight: "bold", color: "#b8860b", marginBottom: "0.5rem" },
  answer: { fontSize: "0.875rem", color: "#4b5563", lineHeight: 1.7 },
};
