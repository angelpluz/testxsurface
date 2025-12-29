# XSF FullStack Developer Test - Pt.2

Next.js App Router + MongoDB (Mongoose) + styled-components implementation for the XSF coding test.

## Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas or local MongoDB instance

## Environment setup

Create `.env.local` in the project root:

```bash
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<database>?retryWrites=true&w=majority
```

## Install

```bash
npm install
```

## Seed sample data

```bash
npm run seed
```

This script clears the `products` collection and inserts 10 sample products.

## Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

- `/` Landing page with CTA links
- `/products` Product list + search
- `/upload` Upload product form
- `/products/[id]` Product detail (optional page included)

## API endpoints

- `GET /api/products` - list products (sorted by `createdAt` desc)
  - Optional: `?search=term` to search by name or code (case-insensitive, partial)
- `POST /api/products` - create product
- `GET /api/products/[id]` - fetch product by Mongo `_id`

## Schema design notes

- `code` is unique to avoid duplicate product entries.
- `images` stores URL strings only; no file uploads.
- `price` is optional and validated as numeric when provided.
- `createdAt` and `updatedAt` are managed by Mongoose timestamps.

## Scripts

- `npm run dev` - start dev server
- `npm run seed` - seed database with sample products
