"use client";

import React from "react";
import { useI18n } from "../lib/i18n";

export default function Footer() {
  const { t } = useI18n();
  const tx = (k, fb) => {
    const v = t ? t(k) : undefined;
    return v && v !== k ? v : fb;
  };

  return (
    <>
      <footer style={styles.footer}>
        <div style={styles.container}>
          <div style={styles.textCenter}>
            <h3 style={styles.title}>{tx("footer.brand", "Mother Vegetables Confidence")}</h3>
            <p className="subtitle" style={styles.subtitle}>{tx("footer.model", "MV-Si002")}</p>

            <div style={styles.section}>
              <p style={styles.company}>{tx("footer.company", "dotpb株式会社")}</p>
              <p style={styles.text}>{tx("footer.zip", "〒103-0026")}</p>
              <p style={styles.text}>{tx("footer.address", "東京都中央区日本橋兜町5-1 兜町第1平和ビル3階")}</p>
              <a href="mailto:info@dotpb.jp" style={styles.email}>
                {tx("footer.emailText", "info@dotpb.jp")}
              </a>
            </div>

            <div style={styles.section}>
              <a
                href="https://www.dotpb.jp/specified-commercial-transactions-act"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
              >
                {tx("footer.legalText", "特定商取引に基づく表記")}
              </a>
            </div>

            <div className="separator" style={styles.separator} />

            <p className="copyright" style={styles.copyright}>
              {tx("footer.copyright", "Copyright © 2025 dotpb Co.,Ltd. All Rights Reserved.")}
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @media (min-width: 768px) {
          h3 { font-size: 1.5rem !important; }
          p.subtitle { font-size: 1.125rem !important; }
          p.copyright { font-size: 0.875rem !important; }
          div.separator { width: 8rem !important; margin-bottom: 2rem !important; }
        }
      `}</style>
    </>
  );
}

const styles = {
  footer: {
    padding: "4rem 1rem",
    backgroundColor: "#f3f4f6",
    borderTop: "1px solid #e5e7eb",
  },
  container: { maxWidth: "1200px", margin: "0 auto" },
  textCenter: { textAlign: "center" },
  title: {
    fontSize: "1.25rem",
    color: "#b8860b",
    marginBottom: "1rem",
    fontWeight: 300,
    letterSpacing: "0.1em",
  },
  subtitle: { fontSize: "1rem", color: "#4b5563", marginBottom: "2rem" },
  section: { marginBottom: "2rem" },
  company: { fontSize: "0.875rem", fontWeight: 500, color: "#374151", marginBottom: "0.5rem" },
  text: { fontSize: "0.875rem", color: "#4b5563" },
  email: { fontSize: "0.875rem", color: "#b8860b", textDecoration: "none" },
  link: { fontSize: "0.875rem", color: "#4b5563", textDecoration: "none", transition: "color 0.3s" },
  separator: {
    width: "6rem",
    height: "1px",
    background: "linear-gradient(to right, transparent, #B8860B, transparent)",
    margin: "2rem auto",
  },
  copyright: { fontSize: "0.75rem", color: "#6b7280", fontWeight: 300 },
};
