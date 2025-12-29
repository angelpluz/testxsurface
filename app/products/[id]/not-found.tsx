import Link from "next/link";

export default function ProductDetailNotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "56px 24px 96px",
        background: "#f7f7f4",
        display: "grid",
        placeItems: "center",
      }}
    >
      <section
        style={{
          maxWidth: "420px",
          background: "#ffffff",
          borderRadius: "18px",
          padding: "24px",
          border: "1px solid rgba(27, 26, 23, 0.08)",
          textAlign: "center",
          display: "grid",
          gap: "12px",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "20px" }}>Product not found</h1>
        <p style={{ margin: 0, fontSize: "13px", color: "#6b645d" }}>
          The product you are looking for does not exist.
        </p>
        <Link
          href="/products"
          style={{
            borderRadius: "999px",
            padding: "8px 16px",
            background: "#1b1a17",
            color: "#ffffff",
            fontWeight: 600,
            textDecoration: "none",
            justifySelf: "center",
          }}
        >
          Back to Products
        </Link>
      </section>
    </main>
  );
}
