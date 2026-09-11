# TearRubr

### Verifying what's real in a world full of counterfeits.

TearRubr is a product authentication platform that gives physical products a **verifiable digital identity**.

Manufacturers register products with TearRubr and associate each product with a unique identifier. When a customer purchases an item, they can scan its TearRubr code and verify whether the product corresponds to a legitimate record.

The goal is simple:

> **Make it possible to verify a physical product without having to trust the seller.**

TearRubr uses blockchain as a public, tamper-resistant verification layer while keeping application data and user-facing functionality in conventional infrastructure.

---

## The Problem

Counterfeit products are difficult to identify because consumers generally have to trust:

* The seller
* Packaging
* Serial numbers
* Logos and branding
* Product appearance
* The marketplace where the product was purchased

Those signals can all be copied.

A counterfeit product can have convincing packaging, a copied serial number, and even a fake verification website.

The fundamental problem is that **the customer has no independent way to establish that the product they're holding corresponds to a legitimate product record created by the manufacturer.**

TearRubr addresses this by giving products a digital identity whose important authenticity records can be independently verified.

---

## How TearRubr Works

The system has two primary participants: **manufacturers and consumers.**

### 1. Manufacturer registers a product

A manufacturer creates a product record through TearRubr.

The product receives a unique identity that can be represented physically using:

* QR codes
* Serial numbers
* NFC tags
* Other machine-readable identifiers

The manufacturer's registration establishes the initial authenticity record.

### 2. Product enters the market

The physical product is distributed normally.

The TearRubr identifier travels with the product.

### 3. Customer verifies the product

A customer scans the identifier or enters the product ID into TearRubr.

TearRubr retrieves the corresponding product record and checks its authenticity state.

### 4. Verification result

The customer receives a clear result rather than having to interpret blockchain data themselves.

For example:

**AUTHENTIC**

The identifier corresponds to a registered product and the verification data is valid.

**SUSPICIOUS**

The identifier exists, but the verification context indicates something that requires further investigation.

**NOT VERIFIED**

TearRubr cannot establish a legitimate product record for the supplied identifier.

---

## Why Blockchain?

Blockchain is not being used simply because the project involves Web3.

It solves a specific trust problem.

A traditional database can tell a customer:

> "This product is authentic because our database says so."

That requires the customer to completely trust the database operator.

TearRubr instead uses blockchain for the parts of the product identity and verification process where **tamper resistance and independent verification matter**.

Important authenticity events can be committed on-chain, creating a persistent record that cannot be silently rewritten by changing a conventional database.

The application can then combine:

```text
Physical Product
       │
       ▼
Unique Product Identity
       │
       ├──────────────► Application Database
       │
       └──────────────► Blockchain Record
                              │
                              ▼
                       Verification Proof
```

The blockchain therefore acts as a **trust layer**, not as the application's entire database.

---

## Architecture

TearRubr is designed as a modular system:

```text
                         ┌──────────────────┐
                         │     Consumer     │
                         └────────┬─────────┘
                                  │
                             Scan / Verify
                                  │
                                  ▼
┌──────────────────┐      ┌──────────────────┐
│   Manufacturer  │─────►│   SvelteKit App  │
└──────────────────┘      └────────┬─────────┘
                                   │
                                   ▼
                            ┌─────────────┐
                            │     API     │
                            └──────┬──────┘
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
              ┌──────────────┐              ┌──────────────┐
              │ SQLite / ORM │              │ Smart Contract│
              │              │              │               │
              │ Application  │              │ Verification  │
              │ data         │              │ records       │
              └──────────────┘              └───────┬───────┘
                                                   │
                                                   ▼
                                               Blockchain
```

### Frontend

**SvelteKit + TypeScript**

The frontend handles the consumer verification experience and manufacturer-facing interfaces.

### Backend

The API handles application logic that does not belong directly on-chain, including product metadata, authentication, indexing, and other application services.

### Database

**SQLite (via better-sqlite3 + Drizzle ORM)**

SQLite stores application data that does not need blockchain-level immutability.

This keeps the system efficient, zero-config, and avoids putting unnecessary data on-chain.

### Blockchain

The smart contract stores and verifies the parts of a product's identity that benefit from a decentralized, tamper-resistant record.

---

## Core Product Model

At the center of TearRubr is the concept of a **Product Identity**.

Conceptually:

```text
Product
├── Product ID
├── Manufacturer
├── Product information
├── Registration record
├── Verification history
└── Blockchain reference
```

The product ID is the bridge between the physical object and its digital representation.

A QR code, NFC tag, or serial number does not itself make a product authentic.

It provides a way to **reference the product identity**.

TearRubr then verifies that identity against the authoritative records.

---

## Preventing Simple QR-Code Duplication

A QR code alone is not a security mechanism.

A counterfeiter could simply photograph a legitimate QR code and print it onto thousands of fake products.

TearRubr therefore treats the identifier as a **pointer to an identity**, rather than the proof of authenticity itself.

The verification layer can incorporate additional information such as:

* Product registration state
* Verification history
* Manufacturer ownership
* Expected product state
* Blockchain records
* Potentially, physical security features such as NFC or tamper-evident tags

This creates room for stronger anti-counterfeit mechanisms as the system develops.

---

## Repository Structure

The project is organized around the major parts of the application.

```text
tearrubr/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   ├── api/
│   │   ├── blockchain/
│   │   └── utils/
│   │
│   └── routes/
│       ├── +page.svelte
│       ├── verify/
│       ├── register/
│       └── dashboard/
│
├── static/
├── package.json
├── svelte.config.js
└── README.md
```

The exact structure may evolve as the implementation develops.

---

## Current MVP

The initial TearRubr MVP focuses on proving the core authentication flow:

* Manufacturer product registration
* Unique product identity
* Product verification
* Verification status
* Blockchain-backed authenticity records
* Consumer-facing verification interface

The MVP deliberately focuses on the smallest useful version of the system rather than attempting to solve every supply-chain problem at once.

---

## Example Verification Flow

A typical customer interaction looks like this:

```text
Customer purchases product
          │
          ▼
     Scan TearRubr
          │
          ▼
   Product ID extracted
          │
          ▼
   TearRubr verification
          │
          ├───────────────┐
          │               │
          ▼               ▼
   Valid identity     Invalid/
          │           suspicious
          ▼               │
      AUTHENTIC       WARNING
```

The important part is that the customer does not need to understand wallets, smart contracts, block explorers, or blockchain transactions.

**Blockchain is infrastructure. Verification is the product.**

---

## Technology

| Layer            | Technology             |
| ---------------- | ---------------------- |
| Frontend         | SvelteKit 2 + Svelte 5  |
| Language         | TypeScript             |
| Styling          | Tailwind CSS 4         |
| Backend          | SvelteKit API routes   |
| Database         | SQLite (better-sqlite3 + Drizzle ORM) |
| Smart Contracts  | Solidity               |
| Blockchain       | Ethereum Sepolia       |
| Indexing         | The Graph Protocol     |
| Auth             | Web3 Wallet + Privy OTP |
| Product Identity | QR / Serial / NFC      |
| Development      | Node.js + Vite         |

The stack is intentionally modular so individual components can be replaced without redesigning the entire system.

---

## Design Principles

### 1. Blockchain only where it adds value

Not every piece of data belongs on-chain.

TearRubr uses blockchain for verification and trust-sensitive records while using conventional infrastructure for application data.

### 2. Verification should be simple

A consumer should not need to understand Web3 to verify a product.

The interface should answer the question clearly.

### 3. Physical and digital identities must be linked

A blockchain record by itself does not authenticate a physical object.

TearRubr's challenge is connecting the physical product to its digital identity in a way that is difficult to reproduce.

### 4. Trust should be independently verifiable

The system should minimize situations where the only answer to "is this genuine?" is "because our server says it is."

---

## Roadmap

### Phase 1 — Proof of Concept

* Product registration
* Product identity generation
* Consumer verification
* Smart contract integration
* Basic manufacturer dashboard

### Phase 2 — Stronger Physical Authentication

* NFC support
* Tamper-evident identifiers
* Improved duplicate detection
* Verification history
* Product lifecycle tracking

### Phase 3 — Manufacturer Platform

* Manufacturer onboarding
* Bulk product registration
* Analytics
* Distribution tracking
* Product recalls
* Supply-chain integrations

### Phase 4 — Open Verification Infrastructure

The long-term goal is to make TearRubr useful beyond a single application.

Manufacturers, retailers, marketplaces, and consumers could interact with a common product-verification infrastructure rather than each company building isolated authenticity systems.

---

## Running Locally

### Requirements

* Node.js 22+
* npm
* Git

### Installation

Clone the repository:

```bash
git clone https://github.com/primidac/tearrubr.git
cd tearrubr
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

## Environment Variables

Create a `.env` file for local development (see `.env.example`):

```env
BLOCKCHAIN_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
PRIVATE_KEY=your_sepolia_private_key
CONTRACT_ADDRESS=0xa34C7D37BB2bf41f73e562075878E86eFc7Ed05B
PUBLIC_SUBGRAPH_URL=https://api.studio.thegraph.com/query/YOUR_ID/tearrubr-sepolia/v0.0.1
PUBLIC_PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret
```

Never commit private keys, API secrets, or other credentials to the repository.

---

## Project Status

TearRubr has been developed as a functional proof of concept with production-quality features:

* Single product registration with on-chain anchoring
* Industrial batch rollups via Merkle tree cryptography (up to 10,000 units per transaction)
* Real-time decentralized indexing via The Graph Protocol
* Physical tamper-evident seal tracking and breach telemetry
* QR Code Studio for generating print-ready verification seals
* Web3 wallet authentication + Privy passwordless email OTP
* Public verification ledger with search, filtering, and pagination
* Full mobile responsiveness across all pages

The architecture is intentionally designed so the prototype can evolve into a production system.

---

## 🤖 AI Usage & Development Process

In compliance with hackathon transparency guidelines, AI tooling was utilized as an intelligent pair programmer to accelerate development while preserving original human architecture, cryptographic specifications, and system design:

### 🧠 Solo Developer Architecture & Engineering (Solo Creator)
- **Smart Contract Development & Deployment:** Authored, tested, and deployed the core Solidity smart contracts (`TearRubr.sol`) to the Ethereum Sepolia network (`0xa34C7D37BB2bf41f73e562075878E86eFc7Ed05B`), establishing on-chain product registration, state transitions, batch Merkle root commitments, and event indexing triggers.
- **Protocol & Cryptographic Design:** Conceived the physical tamper-evident seal workflow, the dual-hash verification model, and industrial Merkle tree batch rollup specifications.
- **Backend & Data Infrastructure:** Designed the SQLite + Drizzle data model, API routes, and The Graph Protocol subgraph schema and mappings.
- **Product Direction & UX Workflows:** Authored the verification journey, manufacturer batch onboarding flows, and breach telemetry alert mechanisms.

### 🛠️ AI-Assisted Implementation (Antigravity / LLM Tooling)
- **UI/UX Engineering & Styling:** Accelerated Tailwind CSS styling, responsive layout tuning, micro-animations, and Svelte 5 runes component refactoring.
- **Type Safety & Auditing:** Automated `svelte-check` type audits, eliminating hardcoded fallback data, and verifying edge-case handling across API endpoints.
- **Asset Generation:** Generated the 16:9 photorealistic 3D submission banner and optimized SVG branding assets.

---

## Vision

Counterfeit prevention should not depend entirely on consumers being able to recognize subtle differences in packaging or trusting an unknown seller.

A physical product should be able to prove where its identity comes from.

**TearRubr is building that verification layer.**
