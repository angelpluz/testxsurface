"use client";

import Link from "next/link";

import {
  explodeContacts,
  namesByAgeRangeSorted,
  renderBulletListFromNames,
  sampleInputA,
  sampleInputB,
  sampleInputC,
  transformContactsByCode,
} from "@/lib/pt1";

const demoA = transformContactsByCode(sampleInputA);
const demoB = explodeContacts(sampleInputB);
const demoC = namesByAgeRangeSorted(sampleInputC);
const demoD = renderBulletListFromNames(demoC);

// Demo logs (sample inputs from the prompt).
console.log("A:", demoA);
console.log("B:", demoB);
console.log("C:", demoC);
console.log("D:", demoD);

export default function Pt1DemoPage() {
  return (
    <main style={{ padding: "32px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
        <h1 style={{ margin: 0 }}>XSF Pt.1 Demo</h1>
        <Link
          href="/pt1-fetch"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 14px",
            borderRadius: "999px",
            border: "1px solid #1a1a1a",
            textDecoration: "none",
            color: "#1a1a1a",
            fontSize: "14px",
          }}
        >
          Open Fetch Form
        </Link>
      </div>
      <p>Open the console to see the demo logs.</p>

      <h2>(A) transformContactsByCode</h2>
      <pre>{JSON.stringify(demoA, null, 2)}</pre>

      <h2>(B) explodeContacts</h2>
      <pre>{JSON.stringify(demoB, null, 2)}</pre>

      <h2>(C) namesByAgeRangeSorted</h2>
      <pre>{JSON.stringify(demoC, null, 2)}</pre>

      <h2>(D) renderBulletListFromNames</h2>
      <pre>{demoD}</pre>
    </main>
  );
}
