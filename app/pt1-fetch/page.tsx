"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { IBM_Plex_Mono, Sora } from "next/font/google";

import styles from "./page.module.css";
import type { ExplodedContact, TransformedContact } from "@/lib/pt1";

const sora = Sora({ subsets: ["latin"], weight: ["400", "600", "700"] });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"] });

type ApiResponse = {
  success: boolean;
  minAge: number;
  maxAge: number;
  outputs: {
    A: TransformedContact[];
    B: ExplodedContact[];
    C: string[];
    D: string;
  };
};

export default function Pt1FetchPage() {
  const [minAge, setMinAge] = useState("9");
  const [maxAge, setMaxAge] = useState("30");
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (minAge.trim()) params.set("minAge", minAge.trim());
      if (maxAge.trim()) params.set("maxAge", maxAge.trim());
      const query = params.toString();
      const url = query ? `/api/pt1?${query}` : "/api/pt1";

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const payload = (await response.json()) as ApiResponse;
      setData(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`${styles.page} ${sora.className}`}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <p className={styles.kicker}>XSF Pt.1</p>
            <h1 className={styles.title}>ลองดึงข้อมูลจาก API</h1>
            <p className={styles.subtitle}>
              เลือกช่วงอายุ แล้วกดดึงข้อมูลเพื่อดูผลที่ถูกจัดกลุ่ม แยกรายชื่อ และลิสต์ข้อความแบบสั้น ๆ
            </p>
          </div>
          <div className={styles.headerActions}>
            <Link className={styles.ghostButton} href="/pt1-demo">
              Back to demo page
            </Link>
          </div>
        </header>

        <section className={styles.formCard}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="minAge">
                อายุขั้นต่ำ
              </label>
              <input
                id="minAge"
                className={styles.input}
                type="number"
                min={0}
                value={minAge}
                onChange={(event) => setMinAge(event.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="maxAge">
                อายุสูงสุด
              </label>
              <input
                id="maxAge"
                className={styles.input}
                type="number"
                min={0}
                value={maxAge}
                onChange={(event) => setMaxAge(event.target.value)}
              />
            </div>
            <button className={styles.button} type="submit" disabled={loading}>
              {loading ? "กำลังดึงข้อมูล..." : "ดึงข้อมูลจาก API"}
            </button>
          </form>
          <div className={styles.formMeta} aria-live="polite">
            <span className={styles.tag}>จุดเชื่อม: /api/pt1</span>
            <span className={styles.tag}>เงื่อนไข: อายุหาร 3 ลงตัว</span>
            {data ? (
              <span className={styles.statusOk}>
                ช่วงที่ใช้: {data.minAge} - {data.maxAge}
              </span>
            ) : null}
            {error ? <span className={styles.statusError}>{error}</span> : null}
          </div>
        </section>

        <section className={styles.grid}>
          <article className={styles.card}>
            <h2 className={styles.cardTitle}>(A) จัดกลุ่มตามรหัส</h2>
            <p className={styles.cardHint}>รวมเบอร์โทรที่อยู่ในรหัสเดียวกันไว้ด้วยกัน.</p>
            {data ? (
              <pre className={`${styles.codeBlock} ${plexMono.className}`}>
                {JSON.stringify(data.outputs.A, null, 2)}
              </pre>
            ) : (
              <p className={styles.placeholder}>กดปุ่มด้านบนเพื่อเริ่มดึงข้อมูล.</p>
            )}
          </article>

          <article className={styles.card}>
            <h2 className={styles.cardTitle}>(B) แยกรายชื่อ</h2>
            <p className={styles.cardHint}>แยกเป็นรายการ พร้อมข้อมูลลูกค้าและที่อยู่.</p>
            {data ? (
              <pre className={`${styles.codeBlock} ${plexMono.className}`}>
                {JSON.stringify(data.outputs.B, null, 2)}
              </pre>
            ) : (
              <p className={styles.placeholder}>ยังไม่มีข้อมูล.</p>
            )}
          </article>

          <article className={styles.card}>
            <h2 className={styles.cardTitle}>(C) รายชื่อที่เข้าเงื่อนไข</h2>
            <p className={styles.cardHint}>คัดชื่อที่เข้าเงื่อนไข และเรียงตามอายุ.</p>
            {data && data.outputs.C.length > 0 ? (
              <div className={styles.chipRow}>
                {data.outputs.C.map((name, index) => (
                  <span key={`${name}-${index}`} className={styles.chip}>
                    {name}
                  </span>
                ))}
              </div>
            ) : (
              <p className={styles.placeholder}>ไม่พบรายชื่อในช่วงนี้.</p>
            )}
          </article>

          <article className={styles.card}>
            <h2 className={styles.cardTitle}>(D) ลิสต์ข้อความ</h2>
            <p className={styles.cardHint}>สรุปผลจากข้อ (C) แบบบรรทัดสั้น ๆ.</p>
            {data ? (
              <pre className={`${styles.codeBlock} ${plexMono.className}`}>{data.outputs.D}</pre>
            ) : (
              <p className={styles.placeholder}>ยังไม่มีข้อมูล.</p>
            )}
          </article>
        </section>
      </div>
    </main>
  );
}
