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
            <h1 className={styles.title}>API Fetch Form</h1>
            <p className={styles.subtitle}>
              Fetch the grouped contacts, exploded contacts, sorted names, and bullet list from the demo API.
            </p>
          </div>
          <div className={styles.headerActions}>
            <Link className={styles.ghostButton} href="/pt1-demo">
              Back to Demo
            </Link>
          </div>
        </header>

        <section className={styles.formCard}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="minAge">
                Min age
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
                Max age
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
              {loading ? "Fetching..." : "Fetch demo API"}
            </button>
          </form>
          <div className={styles.formMeta} aria-live="polite">
            <span className={styles.tag}>Endpoint: /api/pt1</span>
            <span className={styles.tag}>Rule: age % 3 === 0</span>
            {data ? (
              <span className={styles.statusOk}>
                Range used: {data.minAge} - {data.maxAge}
              </span>
            ) : null}
            {error ? <span className={styles.statusError}>{error}</span> : null}
          </div>
        </section>

        <section className={styles.grid}>
          <article className={styles.card}>
            <h2 className={styles.cardTitle}>(A) Grouped contacts</h2>
            <p className={styles.cardHint}>Grouped by code with combined tel entries.</p>
            {data ? (
              <pre className={`${styles.codeBlock} ${plexMono.className}`}>
                {JSON.stringify(data.outputs.A, null, 2)}
              </pre>
            ) : (
              <p className={styles.placeholder}>Submit the form to fetch data.</p>
            )}
          </article>

          <article className={styles.card}>
            <h2 className={styles.cardTitle}>(B) Exploded contacts</h2>
            <p className={styles.cardHint}>Each contact shares the customer + address.</p>
            {data ? (
              <pre className={`${styles.codeBlock} ${plexMono.className}`}>
                {JSON.stringify(data.outputs.B, null, 2)}
              </pre>
            ) : (
              <p className={styles.placeholder}>No data yet.</p>
            )}
          </article>

          <article className={styles.card}>
            <h2 className={styles.cardTitle}>(C) Names in range</h2>
            <p className={styles.cardHint}>Sorted by age, divisible by 3, rendered as name chips.</p>
            {data && data.outputs.C.length > 0 ? (
              <div className={styles.chipRow}>
                {data.outputs.C.map((name, index) => (
                  <span key={`${name}-${index}`} className={styles.chip}>
                    {name}
                  </span>
                ))}
              </div>
            ) : (
              <p className={styles.placeholder}>No names returned.</p>
            )}
          </article>

          <article className={styles.card}>
            <h2 className={styles.cardTitle}>(D) Bullet list</h2>
            <p className={styles.cardHint}>Formatted output from question C.</p>
            {data ? (
              <pre className={`${styles.codeBlock} ${plexMono.className}`}>{data.outputs.D}</pre>
            ) : (
              <p className={styles.placeholder}>No data yet.</p>
            )}
          </article>
        </section>
      </div>
    </main>
  );
}
