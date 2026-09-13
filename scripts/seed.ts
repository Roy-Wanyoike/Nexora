/**
 * Seed the Nexa Pay demo database with sample data.
 * Run: bun run /home/z/my-project/scripts/seed.ts
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

function rid(len: number, prefix = ""): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return prefix + s;
}

async function main() {
  console.log("🌱 Seeding Nexa Pay demo database...");

  // 1. Demo user
  const user = await db.user.upsert({
    where: { email: "john.doe@nexapay.africa" },
    update: {},
    create: { email: "john.doe@nexapay.africa", name: "John Doe" },
  });

  // 2. API keys (test mode)
  const existingKeys = await db.apiKey.count();
  if (existingKeys === 0) {
    await db.apiKey.createMany({
      data: [
        {
          label: "Backend server",
          key: "nxp_test_8h2k9nbq01def456abc789",
          mode: "test",
          userId: user.id,
        },
        {
          label: "Staging webhook",
          key: "nxp_test_2k9p7xzq3mn1rst456uvw",
          mode: "test",
          userId: user.id,
        },
      ],
    });
    console.log("  ✓ Created 2 test API keys");
  }

  // 3. Customer
  let customer = await db.customer.findFirst({ where: { email: "john.doe@nexapay.africa" } });
  if (!customer) {
    customer = await db.customer.create({
      data: { email: "john.doe@nexapay.africa", name: "John Doe", phone: "+2348000000000" },
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
          bankName: "Nexa Pay / Evolve",
          customerType: "individual",
          customerId: customer.id,
        },
        {
          currency: "GBP",
          accountName: "John Doe",
          accountNumber: "88215647",
          routingNumber: "04-00-19",
          bankName: "Nexa Pay UK Ltd",
          customerType: "individual",
          customerId: customer.id,
        },
        {
          currency: "EUR",
          accountName: "John Doe",
          accountNumber: "DE89370400440532013000",
          routingNumber: "PAYSDEMM",
          bankName: "Nexa Pay EU GmbH",
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
        { type: "payment", amount: 500000, currency: "NGN", status: "succeeded", description: "Pro plan subscription", createdAt: new Date(now) },
        { type: "payout", amount: 24000, currency: "USD", status: "pending", description: "To vendor · PayPal", createdAt: new Date(now - day) },
        { type: "fx_conversion", amount: 200000, currency: "USD", status: "succeeded", description: "USD → NGN", createdAt: new Date(now - 2 * day) },
        { type: "card_charge", amount: 1599, currency: "USD", status: "succeeded", description: "Netflix subscription", createdAt: new Date(now - 3 * day) },
        { type: "payment", amount: 182000, currency: "USD", status: "succeeded", description: "Stripe payout", createdAt: new Date(now - 4 * day) },
        { type: "card_charge", amount: 899, currency: "USD", status: "succeeded", description: "eSIM · UK 10GB", createdAt: new Date(now - 5 * day) },
        { type: "payout", amount: 4821000, currency: "USD", status: "succeeded", description: "Payroll · September", createdAt: new Date(now - 7 * day) },
        { type: "payment", amount: 740000, currency: "NGN", status: "succeeded", description: "DStv renewal", createdAt: new Date(now - 9 * day) },
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
      },
    });
    console.log("  ✓ Created payroll run");
  }

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
