import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  // Clean in dependency order to respect foreign keys
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.article.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.promoCode.deleteMany();

  // Categories
  await prisma.category.createMany({
    data: [
      {
        id: "cat1",
        name: "Boeuf",
        image:
          "https://res.cloudinary.com/ddqrywesr/image/upload/v1743627027/eg5ec1vc9bscz1gimopj.png",
        featured: true,
        description:
          "Côtes, entrecôtes, bavettes, filets et autres morceaux nobles de bœuf, toujours frais et halal.",
      },
      {
        id: "cat2",
        name: "Agneau",
        image:
          "https://res.cloudinary.com/ddqrywesr/image/upload/v1743626541/hcutdkicydtpwwt5epcj.png",
        featured: true,
        description:
          "Gigots savoureux, côtelettes tendres et épaule d'agneau pour vos plats mijotés.",
      },
      {
        id: "cat3",
        name: "Volaille",
        image:
          "https://res.cloudinary.com/ddqrywesr/image/upload/v1743627357/bq5g4kl4eka5b7s9gcih.png",
        featured: true,
        description:
          "Poulet fermier, dinde, pintade et canard pour des recettes traditionnelles ou festives.",
      },
      {
        id: "cat4",
        name: "Épices",
        image:
          "https://res.cloudinary.com/ddqrywesr/image/upload/v1743632470/rn3bmgelf47dbfvm8mcn.png",
        featured: true,
        description:
          "Un assortiment d'épices authentiques pour relever vos viandes et plats maison.",
      },
    ],
    skipDuplicates: true,
  });

  // Articles
  await prisma.article.createMany({
    data: [
      {
        id: "art1",
        name: "Entrecôte de boeuf",
        unit: "kg",
        price: 39.9,
        image: "/images/no-img.png",
        description: "Entrecôte de boeuf maturée.",
        categoryId: "cat1",
      },
      {
        id: "art2",
        name: "Steak haché",
        unit: "kg",
        price: 15.9,
        image: "/images/no-img.png",
        description: "Steak haché pur boeuf.",
        categoryId: "cat1",
      },
      {
        id: "art3",
        name: "Boeuf à bourguignon",
        unit: "kg",
        price: 16.9,
        image: "/images/no-img.png",
        description: "Morceaux de boeuf pour bourguignon.",
        categoryId: "cat1",
      },
      {
        id: "art4",
        name: "Côtelettes d'agneau",
        unit: "kg",
        price: 29.9,
        image: "/images/no-img.png",
        description: "Côtelettes d'agneau fraîches.",
        categoryId: "cat2",
      },
      {
        id: "art5",
        name: "Gigot d'agneau",
        unit: "kg",
        price: 24.9,
        image: "/images/no-img.png",
        description: "Gigot d'agneau entier.",
        categoryId: "cat2",
      },
      {
        id: "art6",
        name: "Poulet entier",
        unit: "pièce",
        price: 12.9,
        image: "/images/no-img.png",
        description: "Poulet fermier entier.",
        categoryId: "cat3",
      },
      {
        id: "art7",
        name: "Escalopes de poulet",
        unit: "kg",
        price: 15.9,
        image: "/images/no-img.png",
        description: "Escalopes de poulet fraîches.",
        categoryId: "cat3",
      },
      {
        id: "art8",
        name: "Mélange Ras el hanout",
        unit: "100g",
        price: 3.5,
        image: "/images/no-img.png",
        description: "Mélange d'épices traditionnel.",
        categoryId: "cat4",
      },
      {
        id: "art9",
        name: "Cumin moulu",
        unit: "100g",
        price: 2.5,
        image: "/images/no-img.png",
        description: "Cumin moulu de qualité.",
        categoryId: "cat4",
      },
      {
        id: "art10",
        name: "Semoule fine",
        unit: "kg",
        price: 3.9,
        image: "/images/no-img.png",
        description: "Semoule fine de qualité supérieure.",
        categoryId: "cat4",
      },
      {
        id: "art11",
        name: "Huile d'olive",
        unit: "litre",
        price: 8.9,
        image: "/images/no-img.png",
        description: "Huile d'olive extra vierge.",
        categoryId: "cat4",
      },
    ],
    skipDuplicates: true,
  });

  // Promo codes
  await prisma.promoCode.createMany({
    data: [
      {
        id: "promo1",
        code: "PROMO10",
        discount: 10,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        maxUses: 100,
        useCount: 0,
        active: true,
      },
      {
        id: "promo2",
        code: "PROMO20",
        discount: 20,
        startDate: new Date(),
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        maxUses: 50,
        useCount: 0,
        active: true,
      },
    ],
    skipDuplicates: true,
  });

  // Users (passwords already bcrypt-hashed in SQL example)
  const hashed = "$2a$12$LQV3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPHAF9fLJgJ2.";
  await prisma.user.createMany({
    data: [
      {
        id: "user1",
        firstname: "Mohammed",
        lastname: "Benali",
        email: "mohammed.benali@example.com",
        phone: "+33123456789",
        password: hashed,
        isAdmin: false,
      },
      {
        id: "user2",
        firstname: "Sarah",
        lastname: "Dubois",
        email: "sarah.dubois@example.com",
        phone: "+33987654321",
        password: hashed,
        isAdmin: false,
      },
      {
        id: "user3",
        firstname: "Admin",
        lastname: "User",
        email: "admin@example.com",
        phone: "+33123123123",
        password: hashed,
        isAdmin: true,
      },
    ],
    skipDuplicates: true,
  });

  // Carts
  await prisma.cart.createMany({
    data: [
      { id: "cart1", userId: "user1" },
      { id: "cart2", userId: "user2" },
    ],
    skipDuplicates: true,
  });

  // Cart items
  await prisma.cartItem.createMany({
    data: [
      { id: "ci1", cartId: "cart1", articleId: "art1", quantity: 2 },
      { id: "ci2", cartId: "cart1", articleId: "art2", quantity: 1 },
    ],
    skipDuplicates: true,
  });

  // Orders (explicit IDs to mirror SQL)
  await prisma.order.createMany({
    data: [
      {
        id: 1,
        userId: "user1",
        total: 95.7,
        status: "PENDING",
        firstname: "Mohammed",
        lastname: "Benali",
        email: "mohammed.benali@example.com",
        phone: "+33123456789",
        promoCodeId: "promo1",
      },
      {
        id: 2,
        userId: "user2",
        total: 47.85,
        status: "COMPLETED",
        firstname: "Sarah",
        lastname: "Dubois",
        email: "sarah.dubois@example.com",
        phone: "+33987654321",
        promoCodeId: "promo2",
      },
    ],
    skipDuplicates: true,
  });

  // Order items (respect composite unique constraint)
  await prisma.orderItem.createMany({
    data: [
      { id: "oi1", orderId: 1, articleId: "art1", quantity: 2, price: 39.9 },
      { id: "oi2", orderId: 1, articleId: "art2", quantity: 1, price: 15.9 },
      { id: "oi3", orderId: 2, articleId: "art2", quantity: 3, price: 15.9 },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });


