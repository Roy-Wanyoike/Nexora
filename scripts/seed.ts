/**
 * Seed the Nexora demo database with sample data.
 * Run: bun run scripts/seed.ts
 */
import { PrismaClient } from "@prisma/client";
import { createHash } from "node:crypto";

const db = new PrismaClient();

function hashKey(rawKey: string): string {
  return createHash("sha256").update(rawKey).digest("hex");
}

// The demo test API key — also used by the frontend Endpoint Explorer.
// The raw key is safe to commit (it's a demo test key); only its hash is stored in the DB.
const DEMO_TEST_KEY = "nxp_test_8h2k9nbq01def456abc789";
const STAGING_TEST_KEY = "nxp_test_2k9p7xzq3mn1rst456uvw";

async function main() {
  console.log("🌱 Seeding Nexora demo database...");

  // 1. Demo user
  let user = await db.user.findFirst({ where: { email: "john.doe@nexora.africa" } });
  if (!user) {
    user = await db.user.create({ data: { email: "john.doe@nexora.africa", name: "John Doe" } });
  }

  // 2. API keys (test mode) — stored as hashes only
  const existingKeys = await db.apiKey.count();
  if (existingKeys === 0) {
    await db.apiKey.create({
      data: {
        label: "Backend server",
        keyHash: hashKey(DEMO_TEST_KEY),
        keyPrefix: DEMO_TEST_KEY.slice(0, 12),
        mode: "test",
        userId: user.id,
      },
    });
    await db.apiKey.create({
      data: {
        label: "Staging webhook",
        keyHash: hashKey(STAGING_TEST_KEY),
        keyPrefix: STAGING_TEST_KEY.slice(0, 12),
        mode: "test",
        userId: user.id,
      },
    });
    console.log("  ✓ Created 2 test API keys (stored as SHA-256 hashes)");
    console.log(`    Demo test key (for the Endpoint Explorer): ${DEMO_TEST_KEY}`);
  }

  // 3. Customer
  let customer = await db.customer.findFirst({ where: { email: "john.doe@nexora.africa" } });
  if (!customer) {
    customer = await db.customer.create({
      data: { email: "john.doe@nexora.africa", name: "John Doe", phone: "+2348000000000" },
    });
  }

  // 4. Virtual card
  const cardCount = await db.virtualCard.count();
  if (cardCount === 0) {
    await db.virtualCard.create({
      data: {
        brand: "visa",
        last4: "4591",
        expMonth: 8,
        expYear: 2029,
        currency: "USD",
        spendingLimit: 200000,
        spendingInterval: "monthly",
        label: "Ads · Meta",
        status: "active",
        customerId: customer.id,
      },
    });
    console.log("  ✓ Created virtual card");
  }

  // 5. Foreign accounts (USD + GBP + EUR)
  const faCount = await db.foreignAccount.count();
  if (faCount === 0) {
    await db.foreignAccount.createMany({
      data: [
        {
          currency: "USD",
          accountName: "John Doe",
          accountNumber: "4591882134",
          routingNumber: "084009519",
          bankName: "Nexora / Evolve",
          customerType: "individual",
          customerId: customer.id,
        },
        {
          currency: "GBP",
          accountName: "John Doe",
          accountNumber: "88215647",
          routingNumber: "04-00-19",
          bankName: "Nexora UK Ltd",
          customerType: "individual",
          customerId: customer.id,
        },
        {
          currency: "EUR",
          accountName: "John Doe",
          accountNumber: "DE89370400440532013000",
          routingNumber: "PAYSDEMM",
          bankName: "Nexora EU GmbH",
          customerType: "individual",
          customerId: customer.id,
        },
      ],
    });
    console.log("  ✓ Created 3 foreign accounts (USD/GBP/EUR)");
  }

  // 6. Recent transactions
  const txCount = await db.transaction.count();
  if (txCount === 0) {
    const now = Date.now();
    const day = 86400000;
    await db.transaction.createMany({
      data: [
        { type: "payment", amount: 500000, currency: "NGN", status: "succeeded", description: "Pro plan subscription", userId: user.id, createdAt: new Date(now) },
        { type: "payout", amount: 24000, currency: "USD", status: "pending", description: "To vendor · PayPal", userId: user.id, createdAt: new Date(now - day) },
        { type: "fx_conversion", amount: 200000, currency: "USD", status: "succeeded", description: "USD → NGN", userId: user.id, createdAt: new Date(now - 2 * day) },
        { type: "card_charge", amount: 1599, currency: "USD", status: "succeeded", description: "Netflix subscription", userId: user.id, createdAt: new Date(now - 3 * day) },
        { type: "payment", amount: 182000, currency: "USD", status: "succeeded", description: "Stripe payout", userId: user.id, createdAt: new Date(now - 4 * day) },
        { type: "card_charge", amount: 899, currency: "USD", status: "succeeded", description: "eSIM · UK 10GB", userId: user.id, createdAt: new Date(now - 5 * day) },
        { type: "payout", amount: 4821000, currency: "USD", status: "succeeded", description: "Payroll · September", userId: user.id, createdAt: new Date(now - 7 * day) },
        { type: "payment", amount: 740000, currency: "NGN", status: "succeeded", description: "DStv renewal", userId: user.id, createdAt: new Date(now - 9 * day) },
      ],
    });
    console.log("  ✓ Created 8 transactions");
  }

  // 7. Payroll run
  const prCount = await db.payrollRun.count();
  if (prCount === 0) {
    await db.payrollRun.create({
      data: {
        status: "scheduled",
        totalAmount: 4821000,
        totalCurrency: "USD",
        itemsCount: 28,
        scheduledFor: new Date("2026-09-30T08:00:00.000Z"),
        userId: user.id,
      },
    });
    console.log("  ✓ Created payroll run");
  }

  console.log("✅ Seed complete.");
  console.log("");
  console.log("Use this key in the Endpoint Explorer or curl:");
  console.log(`  ${DEMO_TEST_KEY}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
