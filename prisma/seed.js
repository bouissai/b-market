// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { id: 'cat-boeuf', name: 'Bœuf', image: 'https://res.cloudinary.com/ddqrywesr/image/upload/v1743627027/eg5ec1vc9bscz1gimopj.png', featured: true,  description: 'Côtes, entrecôtes, bavettes, filets… bœuf frais et halal.' },
    { id: 'cat-agneau', name: 'Agneau', image: 'https://res.cloudinary.com/ddqrywesr/image/upload/v1743626541/hcutdkicydtpwwt5epcj.png', featured: true,  description: 'Gigot, épaule, côtelettes — tendre et savoureux.' },
    { id: 'cat-volaille', name: 'Volaille', image: 'https://res.cloudinary.com/ddqrywesr/image/upload/v1743627357/bq5g4kl4eka5b7s9gcih.png', featured: true,  description: 'Poulet fermier, dinde, pintade — 100% halal.' },
    { id: 'cat-epicerie', name: 'Épicerie', image: 'https://res.cloudinary.com/ddqrywesr/image/upload/v1743632470/rn3bmgelf47dbfvm8mcn.png', featured: false, description: 'Épices et produits d’accompagnement.' },
  ];
  for (const c of categories) {
    await prisma.category.upsert({
      where: { id: c.id },
      update: { name: c.name, image: c.image, featured: c.featured, description: c.description },
      create: c,
    });
  }

  const articles = [
    // Bœuf
    { id: 'art-entrecote', name: 'Entrecôte de bœuf', unit: 'kg', price: 29.9, image: '/images/no-img.png', description: 'Entrecôte tendre, idéale à griller.', categoryId: 'cat-boeuf' },
    { id: 'art-bavette', name: 'Bavette d’aloyau', unit: 'kg', price: 21.9, image: '/images/no-img.png', description: 'Goût marqué, cuisson rapide.', categoryId: 'cat-boeuf' },
    { id: 'art-hache-boeuf', name: 'Steak haché (pur bœuf)', unit: 'kg', price: 14.9, image: '/images/no-img.png', description: 'Hachage du jour, 100% bœuf.', categoryId: 'cat-boeuf' },
    // Agneau
    { id: 'art-cote-agneau', name: 'Côtelettes d’agneau', unit: 'kg', price: 24.9, image: '/images/no-img.png', description: 'À la poêle ou au grill.', categoryId: 'cat-agneau' },
    { id: 'art-gigot-agneau', name: 'Gigot d’agneau', unit: 'kg', price: 22.9, image: '/images/no-img.png', description: 'Rôti fondant au four.', categoryId: 'cat-agneau' },
    { id: 'art-epaule-agneau', name: 'Épaule d’agneau', unit: 'kg', price: 18.9, image: '/images/no-img.png', description: 'Parfait pour tajines et mijotés.', categoryId: 'cat-agneau' },
    // Volaille
    { id: 'art-poulet-entier', name: 'Poulet fermier entier', unit: 'pièce', price: 10.9, image: '/images/no-img.png', description: 'Abattage halal certifié.', categoryId: 'cat-volaille' },
    { id: 'art-escalope-poulet', name: 'Escalopes de poulet', unit: 'kg', price: 13.9, image: '/images/no-img.png', description: 'Prêtes à cuisiner.', categoryId: 'cat-volaille' },
    // Épicerie
    { id: 'art-ras-el-hanout', name: 'Ras el hanout', unit: '100g', price: 3.5, image: '/images/no-img.png', description: 'Mélange d’épices traditionnel.', categoryId: 'cat-epicerie' },
    { id: 'art-cumin', name: 'Cumin moulu', unit: '100g', price: 2.2, image: '/images/no-img.png', description: 'Arôme chaud et terreux.', categoryId: 'cat-epicerie' },
    { id: 'art-semoule', name: 'Semoule fine', unit: 'kg', price: 2.8, image: '/images/no-img.png', description: 'Couscous et pâtisseries.', categoryId: 'cat-epicerie' },
    { id: 'art-huile-olive', name: 'Huile d’olive extra vierge', unit: 'litre', price: 8.9, image: '/images/no-img.png', description: 'Pression à froid.', categoryId: 'cat-epicerie' },
  ];
  for (const a of articles) {
    await prisma.article.upsert({
      where: { id: a.id },
      update: { name: a.name, unit: a.unit, price: a.price, image: a.image, description: a.description, categoryId: a.categoryId },
      create: a,
    });
  }

  const promos = [
    { id: 'promo10', code: 'BIENVENUE10', discount: 10, startDate: new Date(), endDate: new Date(Date.now() + 30*24*3600*1000), maxUses: 200, useCount: 0, active: true },
    { id: 'promo20', code: 'EID20',       discount: 20, startDate: new Date(), endDate: new Date(Date.now() + 15*24*3600*1000), maxUses: 50,  useCount: 0, active: true },
  ];
  for (const p of promos) {
    await prisma.promoCode.upsert({ where: { id: p.id }, update: { ...p }, create: p });
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@bmarket.fr';
  const adminPass  = process.env.ADMIN_PASSWORD || 'ChangeMoi!2025';
  const hashed = await bcrypt.hash(adminPass, 12);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { isAdmin: true },
    create: { id: 'user-admin', firstname: 'Admin', lastname: 'Bmarket', email: adminEmail, phone: '+33123456789', password: hashed, isAdmin: true },
  });
}

main()
  .then(async () => { console.log('✅ Seed terminé'); await prisma.$disconnect(); })
  .catch(async (e) => { console.error('❌ Seed failed', e); await prisma.$disconnect(); process.exit(1); });