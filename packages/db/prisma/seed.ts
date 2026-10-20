/** Seeds the database from the sample content in @nodal/content (fictional data). */
import { PrismaClient } from "@prisma/client";
import { sampleData } from "@nodal/content";

const prisma = new PrismaClient();

async function main() {
  for (const s of sampleData.services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: { ...s, tier: s.tier.toUpperCase() as never, status: "PUBLISHED" },
    });
  }
  for (const sp of sampleData.specialists) {
    const user = await prisma.user.upsert({
      where: { email: `${sp.slug}@nodal.example` },
      update: {},
      create: { email: `${sp.slug}@nodal.example`, name: sp.name, role: "SPECIALIST" },
    });
    await prisma.specialist.upsert({
      where: { slug: sp.slug },
      update: {},
      create: {
        slug: sp.slug, ownerId: user.id, name: sp.name, initials: sp.initials, role: sp.role, headline: sp.headline,
        about: sp.about, location: sp.location, timezone: sp.timezone, utcOffset: sp.utcOffset, languages: sp.languages,
        yearsExperience: sp.yearsExperience, engagement: sp.engagement, responseTime: sp.responseTime,
        availabilityLabel: sp.availability.label, hoursPerWeek: sp.availability.hoursPerWeek, capacity: sp.capacity,
        stackTags: sp.stackTags, stack: sp.stack, bestAt: sp.bestAt, links: sp.links, featured: sp.featured,
        status: "PUBLISHED", disciplines: { connect: [{ slug: sp.discipline }] },
        services: { create: sp.services.map(({ id: _id, ...x }, i) => ({ ...x, featured: !!x.featured, order: i })) },
        experience: { create: sp.experience.map((x, i) => ({ ...x, order: i })) },
        writing: { create: sp.writing },
      },
    });
  }
  await prisma.user.upsert({ where: { email: "admin@nodal.example" }, update: {}, create: { email: "admin@nodal.example", name: "Mira Alvarez", role: "ADMIN" } });
  console.log("Seeded sample content.");
}

main().finally(() => prisma.$disconnect());
